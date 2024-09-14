/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

//import isArray from 'shared/isArray';
//import {DefaultEventPriority} from 'react-reconciler/src/ReactEventPriorities';

import { DefaultEventPriority } from 'react-reconciler/constants';

export type Type = string;
export type Props = object;

export type Container = {
  tag: 'CONTAINER';
  children: Array<Instance | TextInstance>;
  createNodeMock: Function;
};

export type Instance = {
  tag: 'INSTANCE';
  type: string;
  props: object;
  isHidden: boolean;
  children: Array<Instance | TextInstance>;
  internalInstanceHandle: object;
  rootContainerInstance: Container;
};

export type TextInstance = {
  tag: 'TEXT';
  text: string;
  isHidden: boolean;
};

export type HydratableInstance = Instance | TextInstance;
export type PublicInstance = Instance | TextInstance;
export type HostContext = object;
export type UpdatePayload = object;
export type ChildSet = void; // Unused
export type TimeoutHandle = ReturnType<typeof setTimeout>;
export type NoTimeout = -1;
export type EventResponder = any;

export type RendererInspectionConfig = Readonly<{}>;

// export * from 'react-reconciler/src/ReactFiberHostConfigWithNoPersistence';
// export * from 'react-reconciler/src/ReactFiberHostConfigWithNoHydration';
// export * from 'react-reconciler/src/ReactFiberHostConfigWithNoTestSelectors';
// export * from 'react-reconciler/src/ReactFiberHostConfigWithNoMicrotasks';

const NO_CONTEXT = {};
const UPDATE_SIGNAL = {};
const nodeToInstanceMap = new WeakMap();

if (__DEV__) {
  Object.freeze(NO_CONTEXT);
  Object.freeze(UPDATE_SIGNAL);
}

export function getPublicInstance(inst: Instance | TextInstance) {
  switch (inst.tag) {
    case 'INSTANCE': {
      const createNodeMock = inst.rootContainerInstance.createNodeMock;
      const mockNode = createNodeMock({
        type: inst.type,
        props: inst.props,
      });
      if (typeof mockNode === 'object' && mockNode !== null) {
        nodeToInstanceMap.set(mockNode, inst);
      }

      return mockNode;
    }

    default:
      return inst;
  }
}

export function appendChild(
  parentInstance: Instance | Container,
  child: Instance | TextInstance,
): void {
  if (__DEV__) {
    if (!Array.isArray(parentInstance.children)) {
      // eslint-disable-next-line no-console
      console.error(
        'An invalid container has been provided. ' +
          'This may indicate that another renderer is being used in addition to the test renderer. ' +
          '(For example, ReactDOM.createPortal inside of a ReactTestRenderer tree.) ' +
          'This is not supported.',
      );
    }
  }
  const index = parentInstance.children.indexOf(child);
  if (index !== -1) {
    parentInstance.children.splice(index, 1);
  }

  parentInstance.children.push(child);
}

export function insertBefore(
  parentInstance: Instance | Container,
  child: Instance | TextInstance,
  beforeChild: Instance | TextInstance,
): void {
  const index = parentInstance.children.indexOf(child);
  if (index !== -1) {
    parentInstance.children.splice(index, 1);
  }

  const beforeIndex = parentInstance.children.indexOf(beforeChild);
  parentInstance.children.splice(beforeIndex, 0, child);
}

export function removeChild(
  parentInstance: Instance | Container,
  child: Instance | TextInstance,
): void {
  const index = parentInstance.children.indexOf(child);
  parentInstance.children.splice(index, 1);
}

export function clearContainer(container: Container): void {
  container.children.splice(0);
}

export function getRootHostContext(_rootContainerInstance: Container): HostContext {
  return NO_CONTEXT;
}

export function getChildHostContext(
  _parentHostContext: HostContext,
  _type: string,
  _rootContainerInstance: Container,
): HostContext {
  return NO_CONTEXT;
}

export function prepareForCommit(_containerInfo: Container): object | null {
  // noop
  return null;
}

export function resetAfterCommit(_containerInfo: Container): void {
  // noop
}

export function createInstance(
  type: string,
  props: Props,
  rootContainerInstance: Container,
  _hostContext: object,
  internalInstanceHandle: object,
): Instance {
  return {
    type,
    props,
    isHidden: false,
    children: [],
    internalInstanceHandle,
    rootContainerInstance,
    tag: 'INSTANCE',
  };
}

export function appendInitialChild(parentInstance: Instance, child: Instance | TextInstance): void {
  const index = parentInstance.children.indexOf(child);
  if (index !== -1) {
    parentInstance.children.splice(index, 1);
  }

  parentInstance.children.push(child);
}

export function finalizeInitialChildren(
  _testElement: Instance,
  _type: string,
  _props: Props,
  _rootContainerInstance: Container,
  _hostContext: object,
): boolean {
  return false;
}

export function prepareUpdate(
  _testElement: Instance,
  _type: string,
  _oldProps: Props,
  _newProps: Props,
  _rootContainerInstance: Container,
  _hostContext: object,
): object | null {
  return UPDATE_SIGNAL;
}

export function shouldSetTextContent(_type: string, _props: Props): boolean {
  return false;
}

export function createTextInstance(
  text: string,
  _rootContainerInstance: Container,
  _hostContext: object,
  _internalInstanceHandle: object,
): TextInstance {
  return {
    tag: 'TEXT',
    text,
    isHidden: false,
  };
}

export function getCurrentEventPriority(): number {
  return DefaultEventPriority;
}

export const isPrimaryRenderer = false;
export const warnsIfNotActing = true;

export const scheduleTimeout = setTimeout;
export const cancelTimeout = clearTimeout;

export const noTimeout = -1;

// -------------------
//     Mutation
// -------------------

export const supportsMutation = true;

export function commitUpdate(
  instance: Instance,
  _updatePayload: object,
  type: string,
  _oldProps: Props,
  newProps: Props,
  _internalInstanceHandle: object,
): void {
  instance.type = type;
  instance.props = newProps;
}

export function commitMount(
  _instance: Instance,
  _type: string,
  _newProps: Props,
  _internalInstanceHandle: object,
): void {
  // noop
}

export function commitTextUpdate(
  textInstance: TextInstance,
  _oldText: string,
  newText: string,
): void {
  textInstance.text = newText;
}

export function resetTextContent(_testElement: Instance): void {
  // noop
}

export const appendChildToContainer = appendChild;
export const insertInContainerBefore = insertBefore;
export const removeChildFromContainer = removeChild;

export function hideInstance(instance: Instance): void {
  instance.isHidden = true;
}

export function hideTextInstance(textInstance: TextInstance): void {
  textInstance.isHidden = true;
}

export function unhideInstance(instance: Instance, _props: Props): void {
  instance.isHidden = false;
}

export function unhideTextInstance(textInstance: TextInstance, _text: string): void {
  textInstance.isHidden = false;
}

export function getInstanceFromNode(mockNode: object) {
  const instance = nodeToInstanceMap.get(mockNode);
  if (instance !== undefined) {
    return instance.internalInstanceHandle;
  }
  return null;
}

export function beforeActiveInstanceBlur(_internalInstanceHandle: object) {
  // noop
}

export function afterActiveInstanceBlur() {
  // noop
}

export function preparePortalMount(_portalInstance: Instance): void {
  // noop
}

export function prepareScopeUpdate(scopeInstance: object, inst: object): void {
  nodeToInstanceMap.set(scopeInstance, inst);
}

export function getInstanceFromScope(scopeInstance: object): object | null {
  return nodeToInstanceMap.get(scopeInstance) || null;
}

export function detachDeletedInstance(_node: Instance): void {
  // noop
}

export function logRecoverableError(_error: unknown): void {
  // noop
}
