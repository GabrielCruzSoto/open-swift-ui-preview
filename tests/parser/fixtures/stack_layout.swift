import SwiftUI

struct StackLayoutView: View {
    var body: some View {
        VStack(spacing: 16) {
            Text("Title")
                .font(.title)
                .bold()
            HStack(spacing: 8) {
                Text("Left")
                Spacer()
                Text("Right")
            }
            Divider()
            Text("Footer")
                .foregroundColor(.gray)
        }
        .padding()
    }
}
