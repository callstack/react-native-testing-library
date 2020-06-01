#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>

NS_ASSUME_NONNULL_BEGIN

@interface PureButton : UIButton

@property (nonatomic, copy) RCTBubblingEventBlock onPress;

@end

NS_ASSUME_NONNULL_END
