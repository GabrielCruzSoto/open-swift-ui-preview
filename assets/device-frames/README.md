# Device Frames

This directory contains PNG device frame images for iPhone 15, 16, and 17 series.

## Required Images

Each device needs a PNG frame with:
- Transparent background
- Device bezel and rounded corners
- Notch or Dynamic Island
- Screen area where the preview will be composited

## Structure

```
device-frames/
├── iphone15/
│   ├── iphone15.png
│   ├── iphone15plus.png
│   ├── iphone15pro.png
│   └── iphone15promax.png
├── iphone16/
│   ├── iphone16.png
│   ├── iphone16plus.png
│   ├── iphone16pro.png
│   └── iphone16promax.png
└── iphone17/
    ├── iphone17.png
    ├── iphone17plus.png
    ├── iphone17pro.png
    └── iphone17promax.png
```

## Note

For now, the extension uses a programmatic device frame (DeviceFrame.attachFrame) from the renderer module. These PNG assets will be used in a future update to provide more realistic device frames.
