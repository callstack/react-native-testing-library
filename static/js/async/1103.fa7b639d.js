(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["1103"],{3075:function(e,n,r){"use strict";r.r(n);var t=r("5893"),s=r("65");function i(e){let n=Object.assign({h1:"h1",a:"a",pre:"pre",code:"code",div:"div",p:"p",h3:"h3",h4:"h4"},(0,s.ah)(),e.components);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.h1,{id:"fire-event-api",children:["Fire Event API",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#fire-event-api",children:"#"})]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"function fireEvent(element: ReactTestInstance, eventName: string, ...data: unknown[]): void;\n"})}),"\n",(0,t.jsxs)(n.div,{className:"rspress-directive note",children:[(0,t.jsx)(n.div,{className:"rspress-directive-title",children:"NOTE"}),(0,t.jsxs)(n.div,{className:"rspress-directive-content",children:[(0,t.jsxs)(n.p,{children:["For common events like ",(0,t.jsx)(n.code,{children:"press"})," or ",(0,t.jsx)(n.code,{children:"type"})," it's recommended to use ",(0,t.jsx)(n.a,{href:"/docs/api/events/user-event",children:"User Event API"})," as it offers\nmore realistic event simulation by emitting a sequence of events with proper event objects that mimic React Native runtime behavior."]}),"\n",(0,t.jsx)(n.p,{children:"Use Fire Event for cases not supported by User Event and for triggering event handlers on composite components.\n"})]})]}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"fireEvent"})," API allows you to trigger all kinds of event handlers on both host and composite components. It will try to invoke a single event handler traversing the component tree bottom-up from passed element and trying to find enabled event handler named ",(0,t.jsx)(n.code,{children:"onXxx"})," when ",(0,t.jsx)(n.code,{children:"xxx"})," is the name of the event passed."]}),"\n",(0,t.jsx)(n.p,{children:"Unlike User Event, this API does not automatically pass event object to event handler, this is responsibility of the user to construct such object."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-jsx",children:"import { render, screen, fireEvent } from '@testing-library/react-native';\n\ntest('fire changeText event', () => {\n  const onEventMock = jest.fn();\n  render(\n    // MyComponent renders TextInput which has a placeholder 'Enter details'\n    // and with `onChangeText` bound to handleChangeText\n    <MyComponent handleChangeText={onEventMock} />\n  );\n\n  fireEvent(screen.getByPlaceholderText('change'), 'onChangeText', 'ab');\n  expect(onEventMock).toHaveBeenCalledWith('ab');\n});\n"})}),"\n",(0,t.jsxs)(n.div,{className:"rspress-directive note",children:[(0,t.jsx)(n.div,{className:"rspress-directive-title",children:"NOTE"}),(0,t.jsx)(n.div,{className:"rspress-directive-content",children:(0,t.jsxs)(n.p,{children:["Please note that from version ",(0,t.jsx)(n.code,{children:"7.0"})," ",(0,t.jsx)(n.code,{children:"fireEvent"})," performs checks that should prevent events firing on disabled elements.\n"]})})]}),"\n",(0,t.jsxs)(n.p,{children:["An example using ",(0,t.jsx)(n.code,{children:"fireEvent"})," with native events that aren't already aliased by the ",(0,t.jsx)(n.code,{children:"fireEvent"})," api."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-jsx",children:"import { TextInput, View } from 'react-native';\nimport { fireEvent, render } from '@testing-library/react-native';\n\nconst onBlurMock = jest.fn();\n\nrender(\n  <View>\n    <TextInput placeholder=\"my placeholder\" onBlur={onBlurMock} />\n  </View>\n);\n\n// you can omit the `on` prefix\nfireEvent(screen.getByPlaceholderText('my placeholder'), 'blur');\n"})}),"\n",(0,t.jsxs)(n.p,{children:["FireEvent exposes convenience methods for common events like: ",(0,t.jsx)(n.code,{children:"press"}),", ",(0,t.jsx)(n.code,{children:"changeText"}),", ",(0,t.jsx)(n.code,{children:"scroll"}),"."]}),"\n",(0,t.jsxs)(n.h3,{id:"press",children:[(0,t.jsx)(n.code,{children:"fireEvent.press"}),(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#press",children:"#"})]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"fireEvent.press: (element: ReactTestInstance, ...data: Array<any>) => void\n"})}),"\n",(0,t.jsxs)(n.div,{className:"rspress-directive note",children:[(0,t.jsx)(n.div,{className:"rspress-directive-title",children:"NOTE"}),(0,t.jsx)(n.div,{className:"rspress-directive-content",children:(0,t.jsxs)(n.p,{children:["It is recommended to use the User Event ",(0,t.jsx)(n.a,{href:"/docs/api/events/user-event#press",children:(0,t.jsx)(n.code,{children:"press()"})})," helper instead as it offers more realistic simulation of press interaction, including pressable support.\n"]})})]}),"\n",(0,t.jsxs)(n.p,{children:["Invokes ",(0,t.jsx)(n.code,{children:"press"})," event handler on the element or parent element in the tree."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-jsx",children:"import { View, Text, TouchableOpacity } from 'react-native';\nimport { render, screen, fireEvent } from '@testing-library/react-native';\n\nconst onPressMock = jest.fn();\nconst eventData = {\n  nativeEvent: {\n    pageX: 20,\n    pageY: 30,\n  },\n};\n\nrender(\n  <View>\n    <TouchableOpacity onPress={onPressMock}>\n      <Text>Press me</Text>\n    </TouchableOpacity>\n  </View>\n);\n\nfireEvent.press(screen.getByText('Press me'), eventData);\nexpect(onPressMock).toHaveBeenCalledWith(eventData);\n"})}),"\n",(0,t.jsxs)(n.h3,{id:"change-text",children:[(0,t.jsx)(n.code,{children:"fireEvent.changeText"}),(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#change-text",children:"#"})]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"fireEvent.changeText: (element: ReactTestInstance, ...data: Array<any>) => void\n"})}),"\n",(0,t.jsxs)(n.div,{className:"rspress-directive note",children:[(0,t.jsx)(n.div,{className:"rspress-directive-title",children:"NOTE"}),(0,t.jsx)(n.div,{className:"rspress-directive-content",children:(0,t.jsxs)(n.p,{children:["It is recommended to use the User Event ",(0,t.jsx)(n.a,{href:"/docs/api/events/user-event#type",children:(0,t.jsx)(n.code,{children:"type()"})})," helper instead as it offers more realistic simulation of text change interaction, including key-by-key typing, element focus, and other editing events.\n"]})})]}),"\n",(0,t.jsxs)(n.p,{children:["Invokes ",(0,t.jsx)(n.code,{children:"changeText"})," event handler on the element or parent element in the tree."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-jsx",children:"import { View, TextInput } from 'react-native';\nimport { render, screen, fireEvent } from '@testing-library/react-native';\n\nconst onChangeTextMock = jest.fn();\nconst CHANGE_TEXT = 'content';\n\nrender(\n  <View>\n    <TextInput placeholder=\"Enter data\" onChangeText={onChangeTextMock} />\n  </View>\n);\n\nfireEvent.changeText(screen.getByPlaceholderText('Enter data'), CHANGE_TEXT);\n"})}),"\n",(0,t.jsxs)(n.h3,{id:"scroll",children:[(0,t.jsx)(n.code,{children:"fireEvent.scroll"}),(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#scroll",children:"#"})]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"fireEvent.scroll: (element: ReactTestInstance, ...data: Array<any>) => void\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Invokes ",(0,t.jsx)(n.code,{children:"scroll"})," event handler on the element or parent element in the tree."]}),"\n",(0,t.jsxs)(n.h4,{id:"on-a-scrollview",children:["On a ",(0,t.jsx)(n.code,{children:"ScrollView"}),(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#on-a-scrollview",children:"#"})]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-jsx",children:"import { ScrollView, Text } from 'react-native';\nimport { render, screen, fireEvent } from '@testing-library/react-native';\n\nconst onScrollMock = jest.fn();\nconst eventData = {\n  nativeEvent: {\n    contentOffset: {\n      y: 200,\n    },\n  },\n};\n\nrender(\n  <ScrollView onScroll={onScrollMock}>\n    <Text>XD</Text>\n  </ScrollView>\n);\n\nfireEvent.scroll(screen.getByText('scroll-view'), eventData);\n"})}),"\n",(0,t.jsxs)(n.div,{className:"rspress-directive note",children:[(0,t.jsx)(n.div,{className:"rspress-directive-title",children:"NOTE"}),(0,t.jsxs)(n.div,{className:"rspress-directive-content",children:["\n",(0,t.jsxs)(n.p,{children:["Prefer using ",(0,t.jsx)(n.a,{href:"/docs/api/events/user-event#scrollto",children:(0,t.jsx)(n.code,{children:"user.scrollTo"})})," over ",(0,t.jsx)(n.code,{children:"fireEvent.scroll"})," for ",(0,t.jsx)(n.code,{children:"ScrollView"}),", ",(0,t.jsx)(n.code,{children:"FlatList"}),", and ",(0,t.jsx)(n.code,{children:"SectionList"})," components. User Event provides a more realistic event simulation based on React Native runtime behavior."]}),"\n"]})]})]})}function c(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,s.ah)(),e.components);return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(i,{...e})}):i(e)}n.default=c,c.__RSPRESS_PAGE_META={},c.__RSPRESS_PAGE_META["12.x%2Fdocs%2Fapi%2Fevents%2Ffire-event.mdx"]={toc:[{text:"`fireEvent.press`",id:"press",depth:3},{text:"`fireEvent.changeText`",id:"change-text",depth:3},{text:"`fireEvent.scroll`",id:"scroll",depth:3},{text:"On a `ScrollView`",id:"on-a-scrollview",depth:4}],title:"Fire Event API",frontmatter:{}}}}]);