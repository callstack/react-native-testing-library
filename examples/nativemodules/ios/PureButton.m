#import "PureButton.h"

@implementation PureButton

- (instancetype)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  if (self) {
    [self setTitleColor:UIColor.whiteColor forState:UIControlStateNormal];
    self.backgroundColor = [[UIColor alloc] initWithRed:51/255.0 green:217/255.0 blue:178/255.0 alpha:1.0];
    
    [self addTarget:self action:@selector(handleOnPress) forControlEvents:UIControlEventTouchUpInside];
  }
  return self;
}

- (void)handleOnPress {
  self.onPress([[NSDictionary alloc] init]);
}

@end
