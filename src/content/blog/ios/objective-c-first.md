---
title: 为什么我坚持从 Objective-C 学起
description: 在 SwiftUI 与 Swift 当道的年代，从 Objective-C 入门 iOS 不是情怀，是最短路径。
date: 2026-10-02
category: ios
tags: [Objective-C, iOS, 学习路线]
---

在所有人都在聊 Swift 和 SwiftUI 的时候，我从 Objective-C 开始学 iOS。这不是怀旧，而是一个判断：**理解了 Objective-C，才算理解了 iOS 的地基。**

## 消息机制是一切的核心

Objective-C 的方法调用本质是消息发送：

```objc
[obj doSomething];
// 底层是 objc_msgSend(obj, @selector(doSomething))
```

理解了 `objc_msgSend`，Runtime 的方法交换、消息转发、KVO 实现原理都会变得透明。

## 学到的三件事

1. **手动内存管理（MRC）思想**——先理解引用计数从哪来，ARC 才不是魔法
2. **Category 与 Extension 的区别**——分类能不能加属性？为什么？
3. **Block 的本质**——它是一个对象，捕获变量各有强弱

## 下一步

接下来我会把 Runtime 的消息转发全流程整理成一篇长文，配合可运行的 demo 仓库。
