"use strict";(self.webpackChunkreact_native_testing_library_website=self.webpackChunkreact_native_testing_library_website||[]).push([[381],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>k});var l=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,l)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,l,i=function(e,t){if(null==e)return{};var n,l,i={},a=Object.keys(e);for(l=0;l<a.length;l++)n=a[l],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(l=0;l<a.length;l++)n=a[l],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=l.createContext({}),p=function(e){var t=l.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},u=function(e){var t=p(e.components);return l.createElement(s.Provider,{value:t},e.children)},m="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return l.createElement(l.Fragment,{},t)}},c=l.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,s=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),m=p(n),c=i,k=m["".concat(s,".").concat(c)]||m[c]||d[c]||a;return n?l.createElement(k,r(r({ref:t},u),{},{components:n})):l.createElement(k,r({ref:t},u))}));function k(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,r=new Array(a);r[0]=c;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o[m]="string"==typeof e?e:i,r[1]=o;for(var p=2;p<a;p++)r[p]=n[p];return l.createElement.apply(null,r)}return l.createElement.apply(null,n)}c.displayName="MDXCreateElement"},4880:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>r,default:()=>d,frontMatter:()=>a,metadata:()=>o,toc:()=>p});var l=n(7462),i=(n(7294),n(3905));const a={id:"user-event",title:"User Event"},r=void 0,o={unversionedId:"user-event",id:"user-event",title:"User Event",description:"User Event interactions require RNTL v12.2.0 or later.",source:"@site/docs/UserEvent.md",sourceDirName:".",slug:"/user-event",permalink:"/react-native-testing-library/docs/user-event",draft:!1,editUrl:"https://github.com/callstack/react-native-testing-library/blob/main/website/docs/UserEvent.md",tags:[],version:"current",frontMatter:{id:"user-event",title:"User Event"},sidebar:"docs",previous:{title:"Jest Matchers",permalink:"/react-native-testing-library/docs/jest-matchers"},next:{title:"How Should I Query?",permalink:"/react-native-testing-library/docs/how-should-i-query"}},s={},p=[{value:"Comparison with Fire Event API",id:"comparison-with-fire-event-api",level:2},{value:"<code>setup()</code>",id:"setup",level:2},{value:"Options",id:"setup-options",level:3},{value:"<code>press()</code>",id:"press",level:2},{value:"<code>longPress()</code>",id:"longpress",level:2},{value:"Options",id:"longpress-options",level:3},{value:"<code>type()</code>",id:"type",level:2},{value:"Options",id:"type-options",level:3},{value:"Sequence of events",id:"sequence-of-events",level:3},{value:"<code>clear()</code>",id:"clear",level:2},{value:"Sequence of events",id:"sequence-of-events-1",level:3},{value:"<code>scrollTo()</code>",id:"scrollto",level:2},{value:"Options",id:"scroll-to-options",level:3},{value:"Sequence of events",id:"sequence-of-events-2",level:3}],u={toc:p},m="wrapper";function d(e){let{components:t,...n}=e;return(0,i.kt)(m,(0,l.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("admonition",{type:"note"},(0,i.kt)("p",{parentName:"admonition"},"User Event interactions require RNTL v12.2.0 or later.")),(0,i.kt)("h2",{id:"comparison-with-fire-event-api"},"Comparison with Fire Event API"),(0,i.kt)("p",null,"Fire Event is our original event simulation API. It can invoke ",(0,i.kt)("strong",{parentName:"p"},"any event handler")," declared on ",(0,i.kt)("strong",{parentName:"p"},"either host or composite elements"),". Suppose the element does not have ",(0,i.kt)("inlineCode",{parentName:"p"},"onEventName")," event handler for the passed ",(0,i.kt)("inlineCode",{parentName:"p"},"eventName")," event, or the element is disabled. In that case, Fire Event will traverse up the component tree, looking for an event handler on both host and composite elements along the way. By default, it will ",(0,i.kt)("strong",{parentName:"p"},"not pass any event data"),", but the user might provide it in the last argument."),(0,i.kt)("p",null,"In contrast, User Event provides realistic event simulation for user interactions like ",(0,i.kt)("inlineCode",{parentName:"p"},"press")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"type"),". Each interaction will trigger a ",(0,i.kt)("strong",{parentName:"p"},"sequence of events")," corresponding to React Native runtime behavior. These events will be invoked ",(0,i.kt)("strong",{parentName:"p"},"only on host elements"),", and ",(0,i.kt)("strong",{parentName:"p"},"will automatically receive event data")," corresponding to each event."),(0,i.kt)("p",null,"If User Event supports a given interaction, you should always prefer it over the Fire Event counterpart, as it will make your tests much more realistic and, hence, reliable. In other cases, e.g., when User Event does not support the given event or when invoking event handlers on composite elements, you have to use Fire Event as the only available option."),(0,i.kt)("h2",{id:"setup"},(0,i.kt)("inlineCode",{parentName:"h2"},"setup()")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"userEvent.setup(options?: {\n  delay: number;\n  advanceTimers: (delay: number) => Promise<void> | void;\n})\n")),(0,i.kt)("p",null,"Example"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const user = userEvent.setup();\n")),(0,i.kt)("p",null,"Creates a User Event object instance, which can be used to trigger events."),(0,i.kt)("h3",{id:"setup-options"},"Options"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"delay")," controls the default delay between subsequent events, e.g., keystrokes."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"advanceTimers")," is a time advancement utility function that should be used for fake timers. The default setup handles both real timers and Jest fake timers.")),(0,i.kt)("h2",{id:"press"},(0,i.kt)("inlineCode",{parentName:"h2"},"press()")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"press(\n  element: ReactTestInstance,\n): Promise<void>\n")),(0,i.kt)("p",null,"Example"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const user = userEvent.setup();\nawait user.press(element);\n")),(0,i.kt)("p",null,"This helper simulates a press on any pressable element, e.g. ",(0,i.kt)("inlineCode",{parentName:"p"},"Pressable"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"TouchableOpacity"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"Text"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"TextInput"),", etc. Unlike ",(0,i.kt)("inlineCode",{parentName:"p"},"fireEvent.press()"),", a more straightforward API that will only call the ",(0,i.kt)("inlineCode",{parentName:"p"},"onPress")," prop, this function simulates the entire press interaction in a more realistic way by reproducing the event sequence emitted by React Native runtime. This helper will trigger additional events like ",(0,i.kt)("inlineCode",{parentName:"p"},"pressIn")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"pressOut"),"."),(0,i.kt)("h2",{id:"longpress"},(0,i.kt)("inlineCode",{parentName:"h2"},"longPress()")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"longPress(\n  element: ReactTestInstance,\n  options: { duration: number } = { duration: 500 }\n): Promise<void>\n")),(0,i.kt)("p",null,"Example"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const user = userEvent.setup();\nawait user.longPress(element);\n")),(0,i.kt)("p",null,"Simulates a long press user interaction. In React Native, the ",(0,i.kt)("inlineCode",{parentName:"p"},"longPress")," event is emitted when the press duration exceeds the long press threshold (by default, 500 ms). In other aspects, this action behaves similarly to regular ",(0,i.kt)("inlineCode",{parentName:"p"},"press")," action, e.g., by emitting ",(0,i.kt)("inlineCode",{parentName:"p"},"pressIn")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"pressOut")," events. The press duration is customizable through the options. This should be useful if you use the ",(0,i.kt)("inlineCode",{parentName:"p"},"delayLongPress")," prop. When using real timers, this will take 500 ms, so it is highly recommended to use that API with fake timers to prevent the test from taking a long time to run."),(0,i.kt)("h3",{id:"longpress-options"},"Options"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"duration")," - duration of the press in milliseconds. The default value is 500 ms.")),(0,i.kt)("h2",{id:"type"},(0,i.kt)("inlineCode",{parentName:"h2"},"type()")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"type(\n  element: ReactTestInstance,\n  text: string,\n  options?: {\n    skipPress?: boolean\n    submitEditing?: boolean\n  }\n")),(0,i.kt)("p",null,"Example"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const user = userEvent.setup();\nawait user.type(textInput, 'Hello world!');\n")),(0,i.kt)("p",null,"This helper simulates the user focusing on a ",(0,i.kt)("inlineCode",{parentName:"p"},"TextInput")," element, typing ",(0,i.kt)("inlineCode",{parentName:"p"},"text")," one character at a time, and leaving the element."),(0,i.kt)("p",null,"This function supports only host ",(0,i.kt)("inlineCode",{parentName:"p"},"TextInput")," elements. Passing other element types will result in throwing an error."),(0,i.kt)("admonition",{type:"note"},(0,i.kt)("p",{parentName:"admonition"},"This function will add text to the text already present in the text input (as specified by ",(0,i.kt)("inlineCode",{parentName:"p"},"value")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"defaultValue")," props). To replace existing text, use ",(0,i.kt)("a",{parentName:"p",href:"#clear"},(0,i.kt)("inlineCode",{parentName:"a"},"clear()"))," helper first.")),(0,i.kt)("h3",{id:"type-options"},"Options"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"skipPress")," - if true, ",(0,i.kt)("inlineCode",{parentName:"li"},"pressIn")," and ",(0,i.kt)("inlineCode",{parentName:"li"},"pressOut")," events will not be triggered."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"submitEditing")," - if true, ",(0,i.kt)("inlineCode",{parentName:"li"},"submitEditing")," event will be triggered after typing the text.")),(0,i.kt)("h3",{id:"sequence-of-events"},"Sequence of events"),(0,i.kt)("p",null,"The sequence of events depends on the ",(0,i.kt)("inlineCode",{parentName:"p"},"multiline")," prop and the passed options."),(0,i.kt)("p",null,"Events will not be emitted if the ",(0,i.kt)("inlineCode",{parentName:"p"},"editable")," prop is set to ",(0,i.kt)("inlineCode",{parentName:"p"},"false"),"."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Entering the element"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"pressIn")," (optional)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"focus")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"pressOut")," (optional)")),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"pressIn")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"pressOut")," events are sent by default but can be skipped by passing the ",(0,i.kt)("inlineCode",{parentName:"p"},"skipPress: true")," option."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Typing (for each character)"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"keyPress")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"textInput")," (optional)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"change")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"changeText")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"selectionChange"))),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"textInput")," event is sent only for multiline text inputs."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Leaving the element"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"submitEditing")," (optional)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"endEditing")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"blur"))),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"submitEditing")," event is skipped by default. It can sent by setting the ",(0,i.kt)("inlineCode",{parentName:"p"},"submitEditing: true")," option."),(0,i.kt)("h2",{id:"clear"},(0,i.kt)("inlineCode",{parentName:"h2"},"clear()")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"clear(\n  element: ReactTestInstance,\n}\n")),(0,i.kt)("p",null,"Example"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const user = userEvent.setup();\nawait user.clear(textInput);\n")),(0,i.kt)("p",null,"This helper simulates the user clearing the content of a ",(0,i.kt)("inlineCode",{parentName:"p"},"TextInput")," element."),(0,i.kt)("p",null,"This function supports only host ",(0,i.kt)("inlineCode",{parentName:"p"},"TextInput")," elements. Passing other element types will result in throwing an error."),(0,i.kt)("h3",{id:"sequence-of-events-1"},"Sequence of events"),(0,i.kt)("p",null,"The sequence of events depends on the ",(0,i.kt)("inlineCode",{parentName:"p"},"multiline")," prop and passed options."),(0,i.kt)("p",null,"Events will not be emitted if the ",(0,i.kt)("inlineCode",{parentName:"p"},"editable")," prop is set to ",(0,i.kt)("inlineCode",{parentName:"p"},"false"),"."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Entering the element"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"focus"))),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Selecting all content"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"selectionChange"))),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Pressing backspace"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"keyPress")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"textInput")," (optional)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"change")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"changeText")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"selectionChange"))),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"textInput")," event is sent only for multiline text inputs."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Leaving the element"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"endEditing")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"blur"))),(0,i.kt)("h2",{id:"scrollto"},(0,i.kt)("inlineCode",{parentName:"h2"},"scrollTo()")),(0,i.kt)("admonition",{type:"note"},(0,i.kt)("p",{parentName:"admonition"},(0,i.kt)("inlineCode",{parentName:"p"},"scrollTo")," interaction has been introduced in RNTL v12.4.0.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"scrollTo(\n  element: ReactTestInstance,\n  options: {\n    y: number,\n    momentumY?: number,\n    contentSize?: { width: number, height: number },\n    layoutMeasurement?: { width: number, height: number },\n  } | {\n    x: number,\n    momentumX?: number,\n    contentSize?: { width: number, height: number },\n    layoutMeasurement?: { width: number, height: number },\n  }\n")),(0,i.kt)("p",null,"Example"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const user = userEvent.setup();\nawait user.scrollTo(scrollView, { y: 100, momentumY: 200 });\n")),(0,i.kt)("p",null,"This helper simulates the user scrolling a host ",(0,i.kt)("inlineCode",{parentName:"p"},"ScrollView")," element."),(0,i.kt)("p",null,"This function supports only host ",(0,i.kt)("inlineCode",{parentName:"p"},"ScrollView")," elements, passing other element types will result in an error. Note that ",(0,i.kt)("inlineCode",{parentName:"p"},"FlatList")," is accepted as it renders to a host ",(0,i.kt)("inlineCode",{parentName:"p"},"ScrolLView")," element."),(0,i.kt)("p",null,"Scroll interaction should match the ",(0,i.kt)("inlineCode",{parentName:"p"},"ScrollView")," element direction:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"for a vertical scroll view (default or ",(0,i.kt)("inlineCode",{parentName:"li"},"horizontal={false}"),"), you should pass only the ",(0,i.kt)("inlineCode",{parentName:"li"},"y")," option (and optionally also ",(0,i.kt)("inlineCode",{parentName:"li"},"momentumY"),")."),(0,i.kt)("li",{parentName:"ul"},"for a horizontal scroll view (",(0,i.kt)("inlineCode",{parentName:"li"},"horizontal={true}"),"), you should pass only the ",(0,i.kt)("inlineCode",{parentName:"li"},"x")," option (and optionally ",(0,i.kt)("inlineCode",{parentName:"li"},"momentumX"),").")),(0,i.kt)("p",null,"Each scroll interaction consists of a mandatory drag scroll part, which simulates the user dragging the scroll view with his finger (the ",(0,i.kt)("inlineCode",{parentName:"p"},"y")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"x")," option). This may optionally be followed by a momentum scroll movement, which simulates the inertial movement of scroll view content after the user lifts his finger (",(0,i.kt)("inlineCode",{parentName:"p"},"momentumY")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"momentumX")," options)."),(0,i.kt)("h3",{id:"scroll-to-options"},"Options"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"y")," - target vertical drag scroll position"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"x")," - target horizontal drag scroll position"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"momentumY")," - target vertical momentum scroll position"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"momentumX")," - target horizontal momentum scroll position"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"contentSize")," - passed to ",(0,i.kt)("inlineCode",{parentName:"li"},"ScrollView")," events and enabling ",(0,i.kt)("inlineCode",{parentName:"li"},"FlatList")," updates"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"layoutMeasurement")," - passed to ",(0,i.kt)("inlineCode",{parentName:"li"},"ScrollView")," events and enabling ",(0,i.kt)("inlineCode",{parentName:"li"},"FlatList")," updates")),(0,i.kt)("p",null,"User Event will generate several intermediate scroll steps to simulate user scroll interaction. You should not rely on exact number or values of these scrolls steps as they might be change in the future version."),(0,i.kt)("p",null,"This function will remember where the last scroll ended, so subsequent scroll interaction will starts from that position. The initial scroll position will be assumed to be ",(0,i.kt)("inlineCode",{parentName:"p"},"{ y: 0, x: 0 }"),"."),(0,i.kt)("p",null,"To simulate a ",(0,i.kt)("inlineCode",{parentName:"p"},"FlatList")," (and other controls based on ",(0,i.kt)("inlineCode",{parentName:"p"},"VirtualizedList"),") scrolling, you should pass the ",(0,i.kt)("inlineCode",{parentName:"p"},"contentSize")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"layoutMeasurement")," options, which enable the underlying logic to update the currently visible window."),(0,i.kt)("h3",{id:"sequence-of-events-2"},"Sequence of events"),(0,i.kt)("p",null,"The sequence of events depends on whether the scroll includes an optional momentum scroll component."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Drag scroll"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"contentSizeChange")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"scrollBeginDrag")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"scroll")," (multiple events)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"scrollEndDrag"))),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Momentum scroll (optional)"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"momentumScrollBegin")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"scroll")," (multiple events)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"momentumScrollEnd"))))}d.isMDXComponent=!0}}]);