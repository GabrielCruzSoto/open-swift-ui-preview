# Project Overview — OpenSUI

## Project Identity

**OpenSUI** (Open SwiftUI Preview) is a Visual Studio Code extension that enables real-time SwiftUI view previewing without requiring Xcode or Apple hardware.

## Core Value Proposition

- **Cross-platform development**: Works on Windows, Linux, and macOS
- **No Apple hardware required**: Eliminates the need for Mac computers
- **Custom rendering engine**: Independent implementation, no Xcode dependency
- **Real-time preview**: Instant visual feedback as code changes

## Problem Statement

iOS development traditionally requires:
- macOS operating system
- Xcode IDE (Apple-exclusive)
- Apple hardware (Mac computer)

This creates barriers for:
- Cross-platform developers
- Distributed teams without uniform hardware
- Learners without Mac investment
- Organizations preferring multi-platform environments

## Solution Approach

OpenSUI provides:
1. **SwiftUI parser**: Analyzes SwiftUI code structure
2. **Custom rendering engine**: Converts parsed code to visual representation
3. **Device frame library**: Displays preview within iPhone device frames
4. **VS Code integration**: Seamless extension experience

## Key Constraints

- **Static preview**: Shows visual representation, not interactive execution
- **Component subset**: Supports basic SwiftUI components initially
- **No device communication**: All rendering happens within VS Code
- **No Xcode dependency**: Completely independent implementation

## Target Users

- Cross-platform iOS developers
- Distributed development teams
- SwiftUI learners
- UI designers needing quick verification

## Business Model

- **Open source**: Free and open-source project
- **Community-driven**: Welcomes contributions
- **License**: TBD (MIT, Apache 2.0, or GPL)

## Current Status

**Phase**: Conceptualization
- No code implemented yet
- Requirements documented
- Architecture planning needed

## Differentiation from Xcode

| Aspect | Xcode | OpenSUI |
|--------|-------|---------|
| Platform | macOS only | Windows, Linux, macOS |
| Preview type | Full emulator | Static visual representation |
| Hardware | Mac required | Any computer |
| Scope | Full app development | UI design verification |

## Technology Stack

- **Extension host**: Visual Studio Code
- **Language**: TypeScript
- **Runtime**: Node.js >=18.0.0
- **VS Code API**: ^1.85.0
- **Testing**: Jest
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier

## Supported SwiftUI Components (Initial)

| Category | Components |
|-----------|-------------|
| Layout | VStack, HStack, ZStack, Spacer |
| Text | Text |
| Controls | Button, Toggle, Slider, TextField, Picker |
| Containers | List, ScrollView, NavigationStack, TabView |
| Multimedia | Image |
| Structure | Divider |

## Device Support

- iPhone 15 series (15, 15 Plus, 15 Pro, 15 Pro Max)
- iPhone 16 series (16, 16 Plus, 16 Pro, 16 Pro Max)
- iPhone 17 series (17, 17 Plus, 17 Pro, 17 Pro Max)

## Project Phases (Planned)

1. **Phase 1**: Architecture design and project setup
2. **Phase 2**: SwiftUI parser implementation
3. **Phase 3**: Rendering engine development
4. **Phase 4**: Device frame integration
5. **Phase 5**: VS Code extension integration
6. **Phase 6**: Testing and quality assurance
7. **Phase 7**: Release and documentation

## Success Metrics

- Parse time < 1 second for simple views
- Render time < 2 seconds
- Update time < 3 seconds on code changes
- Memory usage < 200 MB idle
- Test coverage ≥ 80%
