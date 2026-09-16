import AVFoundation
import AppKit
import Foundation

let dir = URL(fileURLWithPath: CommandLine.arguments[1])
let outURL = dir.appendingPathComponent("hopin-launch-hindi.mp4")
let audioURL = dir.appendingPathComponent("hopin-launch-hindi.m4a")
let names = [
    "reel-01-launch.png",
    "reel-02-room.png",
    "reel-03-offer.png",
    "reel-04-steps.png",
    "reel-05-cta.png"
]
let imageURLs = names.map { dir.appendingPathComponent($0) }
let width = 1080
let height = 1920
let fps: Int32 = 30

func loadCG(_ url: URL) -> CGImage {
    guard let img = NSImage(contentsOf: url),
          let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        fatalError("Missing \(url.lastPathComponent)")
    }
    return cg
}

func makeBuffer(_ image: CGImage) -> CVPixelBuffer {
    var buffer: CVPixelBuffer?
    CVPixelBufferCreate(
        kCFAllocatorDefault, width, height, kCVPixelFormatType_32ARGB,
        [
            kCVPixelBufferCGImageCompatibilityKey: true,
            kCVPixelBufferCGBitmapContextCompatibilityKey: true
        ] as CFDictionary,
        &buffer
    )
    guard let pb = buffer else { fatalError("pixel buffer") }
    CVPixelBufferLockBaseAddress(pb, [])
    let ctx = CGContext(
        data: CVPixelBufferGetBaseAddress(pb),
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: CVPixelBufferGetBytesPerRow(pb),
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue
    )!
    ctx.setFillColor(CGColor(red: 0.07, green: 0.05, blue: 0.04, alpha: 1))
    ctx.fill(CGRect(x: 0, y: 0, width: width, height: height))
    ctx.interpolationQuality = .high
    let iw = CGFloat(image.width)
    let ih = CGFloat(image.height)
    let scale = max(CGFloat(width) / iw, CGFloat(height) / ih)
    let dw = iw * scale
    let dh = ih * scale
    ctx.draw(image, in: CGRect(x: (CGFloat(width) - dw) / 2, y: (CGFloat(height) - dh) / 2, width: dw, height: dh))
    CVPixelBufferUnlockBaseAddress(pb, [])
    return pb
}

let audioAsset = AVURLAsset(url: audioURL)
let duration = CMTimeGetSeconds(audioAsset.duration)
let perSlide = duration / Double(imageURLs.count)
let framesPerSlide = max(Int(perSlide * Double(fps)), 1)

let tmpVideo = dir.appendingPathComponent("tmp-silent.mp4")
try? FileManager.default.removeItem(at: tmpVideo)
try? FileManager.default.removeItem(at: outURL)

let writer = try AVAssetWriter(outputURL: tmpVideo, fileType: .mp4)
let videoInput = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: width,
    AVVideoHeightKey: height,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: 6_000_000,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel
    ]
])
videoInput.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(
    assetWriterInput: videoInput,
    sourcePixelBufferAttributes: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB,
        kCVPixelBufferWidthKey as String: width,
        kCVPixelBufferHeightKey as String: height
    ]
)
writer.add(videoInput)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

var frameIndex = 0
for url in imageURLs {
    let pb = makeBuffer(loadCG(url))
    for _ in 0..<framesPerSlide {
        while !videoInput.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.005) }
        adaptor.append(pb, withPresentationTime: CMTime(value: CMTimeValue(frameIndex), timescale: fps))
        frameIndex += 1
    }
}
videoInput.markAsFinished()
let sem = DispatchSemaphore(value: 0)
writer.finishWriting { sem.signal() }
sem.wait()
guard writer.status == .completed else {
    fputs("video write failed: \(writer.error?.localizedDescription ?? "unknown")\n", stderr)
    exit(1)
}

let mix = AVMutableComposition()
let videoAsset = AVURLAsset(url: tmpVideo)
guard let vTrack = videoAsset.tracks(withMediaType: .video).first,
      let aTrack = audioAsset.tracks(withMediaType: .audio).first,
      let cv = mix.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid),
      let ca = mix.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid) else {
    fputs("composition failed\n", stderr)
    exit(1)
}
let videoDur = videoAsset.duration
try cv.insertTimeRange(CMTimeRange(start: .zero, duration: videoDur), of: vTrack, at: .zero)
try ca.insertTimeRange(CMTimeRange(start: .zero, duration: videoDur), of: aTrack, at: .zero)

guard let export = AVAssetExportSession(asset: mix, presetName: AVAssetExportPresetHighestQuality) else {
    fputs("export session failed\n", stderr)
    exit(1)
}
export.outputURL = outURL
export.outputFileType = .mp4
export.shouldOptimizeForNetworkUse = true
let sem2 = DispatchSemaphore(value: 0)
export.exportAsynchronously { sem2.signal() }
sem2.wait()
try? FileManager.default.removeItem(at: tmpVideo)
if export.status != .completed {
    fputs("mux failed: \(export.error?.localizedDescription ?? "unknown")\n", stderr)
    exit(1)
}
print(outURL.path)
