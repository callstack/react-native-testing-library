package com.callstack.examples.button

import android.content.Context
import android.graphics.Color
import androidx.appcompat.widget.AppCompatButton
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.RCTEventEmitter

val buttonColor = Color.parseColor("#33d9b2")

class PureButton(context: Context?) : AppCompatButton(context) {
    init {
        setTextColor(Color.WHITE)
        setBackgroundColor(buttonColor)
        setOnClickListener { _ ->
            val event: WritableMap = Arguments.createMap()
            event.putString("action", "click")

            val reactContext = getContext() as ReactContext
            reactContext
                .getJSModule(RCTEventEmitter::class.java)
                .receiveEvent(id, "press", event)
        }
    }
}
