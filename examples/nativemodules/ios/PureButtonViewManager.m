#import "PureButtonViewManager.h"
#import "PureButton.h"

@implementation PureButtonViewManager

RCT_EXPORT_MODULE(PureButton)

RCT_EXPORT_VIEW_PROPERTY(enabled, BOOL)

RCT_CUSTOM_VIEW_PROPERTY(title, NSString, UIButton) {
    [view setTitle:json forState:UIControlStateNormal];
}

RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

- (UIButton *)view
{
  return [[PureButton alloc] initWithFrame:CGRectZero];
}

@end
