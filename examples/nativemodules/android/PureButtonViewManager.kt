package com.weatherapp.button

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class PureButtonViewManager : SimpleViewManager<PureButton>() {
    override fun getName() = "PureButton"

    override fun createViewInstance(reactContext: ThemedReactContext): PureButton {
        return PureButton(reactContext)
    }

    override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any>? {
        return mapOf(
            "press" to mapOf(
                "phasedRegistrationNames" to mapOf("bubbled" to "onPress")
            )
        )
    }

    @ReactProp(name = "enabled")
    fun setEnabled(button: PureButton, enabled: Boolean?) {
        button.isEnabled = enabled!!
    }

    @ReactProp(name = "title")
    fun setTitle(button: PureButton, title: String?) {
        button.text = title
    }
}
