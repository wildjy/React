# JavaScript 핵심 개념 정리

프론트엔드 면접에서 가장 자주 나오는 개념들

- Scope (스코프)
- Closure (클로저)
- this
- Prototype
- Event Loop
- Microtask Queue
- Promise
- Async/Await

---

# 1. Scope (스코프)

## 정의

변수에 접근할 수 있는 범위

```js
const name = 'kim';

function test() {
  const age = 20;

  console.log(name);
}

console.log(age);
```

결과

```bash
ReferenceError
```

---

## 종류

### Global Scope

```js
const user = 'kim';
```

어디서든 접근 가능

---

### Function Scope

```js
function test() {
  const age = 20;
}
```

함수 내부에서만 접근 가능

---

### Block Scope

```js
if (true) {
  const age = 20;
}

console.log(age);
```

결과

```bash
ReferenceError
```

---

## var와 let/const 차이

### var

```js
if (true) {
  var age = 20;
}

console.log(age);
```

결과

```bash
20
```

함수 스코프

---

### let, const

```js
if (true) {
  const age = 20;
}

console.log(age);
```

결과

```bash
ReferenceError
```

블록 스코프

---

## 면접 답변

스코프는 변수에 접근 가능한 범위를 의미하며 전역, 함수, 블록 스코프로 나뉩니다.

---

# 2. Closure (클로저)

## 정의

함수가 생성될 당시의 스코프를 기억하는 것

---

## 예제

```js
function outer() {
  let count = 0;

  return function inner() {
    count++;

    console.log(count);
  };
}

const fn = outer();

fn();
fn();
fn();
```

결과

```bash
1
2
3
```

---

## 왜 가능한가?

원래는

```js
outer();
```

실행이 끝나면

```js
count
```

가 제거되어야 함

하지만

```js
inner
```

가 count를 참조하고 있으므로

JS 엔진이 메모리에 유지

---

## 메모리 구조

```txt
outer 실행

count = 0

↓

inner가 count 참조

↓

outer 종료

↓

count 유지

↓

inner 실행 가능
```

---

## React에서

```js
const handleClick = () => {
  console.log(count);
};
```

이것도 클로저

함수가 count를 기억

---

## 면접 답변

클로저는 함수가 선언된 시점의 렉시컬 스코프를 기억하여 외부 함수가 종료된 이후에도 변수에 접근할 수 있게 하는 기능입니다.

---

# 3. this

## 정의

함수를 호출한 객체

---

## 객체 메서드

```js
const user = {
  name: 'kim',

  getName() {
    console.log(this.name);
  },
};

user.getName();
```

결과

```bash
kim
```

---

## 일반 함수

```js
function test() {
  console.log(this);
}

test();
```

브라우저

```js
window
```

strict mode

```js
undefined
```

---

## 화살표 함수

```js
const user = {
  name: 'kim',

  getName: () => {
    console.log(this.name);
  },
};

user.getName();
```

결과

```bash
undefined
```

---

## 이유

화살표 함수는

```txt
자신의 this 없음
```

상위 스코프의 this 사용

---

## React에서

```js
const handleClick = () => {};
```

를 사용하는 이유

```txt
this 신경 안 써도 됨
```

---

# 4. Prototype

## 정의

JavaScript 객체 상속 메커니즘

---

## 예제

```js
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function () {
  console.log('hello');
};

const p1 = new Person('kim');

p1.sayHello();
```

---

## 내부 구조

```txt
p1
 ↓
Person.prototype
 ↓
Object.prototype
 ↓
null
```

---

## 탐색 과정

```js
p1.sayHello();
```

1. p1 확인
2. 없으면 prototype 확인
3. 있으면 실행

---

## 실제 예

```js
const arr = [1, 2, 3];

arr.map();
```

map은 어디 있을까?

```txt
Array.prototype.map
```

---

## 면접 답변

프로토타입은 JavaScript 객체 간 상속을 구현하기 위한 메커니즘이며 객체는 프로토타입 체인을 통해 속성과 메서드를 탐색합니다.

---

# 5. Event Loop

## 정의

JavaScript 비동기 처리 메커니즘

---

## JavaScript 특징

```txt
Single Thread
```

한 번에 하나의 작업만 수행

---

## 예제

```js
console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

console.log(3);
```

결과

```bash
1
3
2
```

---

## 구조

```txt
Call Stack

↓

Web API

↓

Task Queue

↓

Event Loop
```

---

## 실행 과정

```txt
1 출력

↓

setTimeout 등록

↓

3 출력

↓

Call Stack 비움

↓

Task Queue 실행

↓

2 출력
```

---

# 6. Microtask Queue

## 정의

Task Queue보다 우선순위가 높은 큐

---

## 포함

```txt
Promise.then

queueMicrotask

MutationObserver
```

---

## 예제

```js
console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

Promise.resolve().then(() => {
  console.log(3);
});

console.log(4);
```

결과

```bash
1
4
3
2
```

---

## 실행 순서

```txt
Call Stack

↓

Microtask Queue

↓

Task Queue
```

---

## 핵심

```js
Promise
```

는

```js
setTimeout
```

보다 먼저 실행

---

# 7. Promise

## 정의

비동기 작업의 결과를 나타내는 객체

---

## 상태

```txt
Pending

↓

Fulfilled
```

또는

```txt
Pending

↓

Rejected
```

---

## 예제

```js
fetch('/api')
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });
```

---

## 장점

비동기 콜백 지옥 해결

---

# 8. Async / Await

## 정의

Promise를 동기식 코드처럼 작성하는 문법

---

## Promise 방식

```js
fetch('/api')
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  });
```

---

## Async Await

```js
async function getData() {
  const res = await fetch('/api');

  const data = await res.json();

  console.log(data);
}
```

---

## 주의

```js
await
```

는

```txt
현재 함수만 잠시 멈춤
```

JavaScript 전체가 멈추는 것은 아님

---

# 면접 단골 문제

## 문제 1

```js
console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

Promise.resolve().then(() => {
  console.log(3);
});

console.log(4);
```

정답

```bash
1
4
3
2
```

---

## 문제 2

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  });
}
```

결과

```bash
3
3
3
```

---

이유

```txt
var는 함수 스코프

클로저가 같은 i 참조
```

---

해결

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  });
}
```

결과

```bash
0
1
2
```

---

# 최종 암기표

| 개념 | 핵심 |
|--------|--------|
| Scope | 변수 접근 범위 |
| Closure | 스코프 기억 |
| this | 호출한 객체 |
| Prototype | 상속 메커니즘 |
| Event Loop | 비동기 처리 |
| Microtask | Promise 우선 큐 |
| Promise | 비동기 결과 객체 |
| Async/Await | Promise 문법 개선 |