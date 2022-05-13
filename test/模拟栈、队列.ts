/** 
 * 模拟栈
 */
export class Stack<T>{
  private items: T[] = [];
  /** 
   *  入栈 -> 添加一个/多个元素至栈顶
   */
  push(...elements: T[]) {
    this.items.push(...elements)
  }
  /** 
   * 出栈 -> 移除栈顶元素，并返回被移除的元素
  */
  pop() {
    return this.items.pop()
  }
  /** 
   * 返回栈顶元素
  */
  peek() {
    return this.items[this.items.length - 1]
  }
  /** 
   * 该栈是否存在元素
  */
  isEmpty() {
    return this.items.length === 0
  }
  /** 
   * 移除栈中所有元素
  */
  clear() {
    this.items = []
  }
  /** 
   * 栈中元素个数
  */
  size() {
    return this.items.length
  }
}

/**
 * 模拟队列
 */
export class Queue<T>{
  private items: T[] = [];
  /**
   * 入队 -> 添加一个/多个元素至队尾
   */
  enqueue(...elements: T[]) {
    this.items.push(...elements)
  }
  /** 
   * 出队 -> 移除队首元素, 并返回被移除的元素
  */
  dequeue() {
    return this.items.shift()
  }
  /**
   * 返回队首元素
  */
  peek() {
    return this.items[0]
  }
  /** 
   * 该队列是否存在元素
  */
  isEmpty() {
    return this.items.length === 0
  }
  /** 
   * 队列中元素个数
  */
  size() {
    return this.items.length
  }
}


interface Map {
  [key: string]: string
}
const str = "{[(2021-7-28)]}"
// 判断是否有效字符串
const isValid = (str: string) => {
  // 创建模拟栈的实例
  const stack = new Stack()
  const strMap:Map = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  for (let i of str) {
    if (['(', '[', '{'].includes(i)) {
      stack.push(i)
    }

    if(strMap[i]){
      if (strMap[i] === stack.peek()) {
        stack.pop()
      } else {
        return false
      }
    }
  }
  return stack.size() === 0
}

console.log(isValid(str))


