import { shallowReactive, ref } from 'vue'

type AnyFn = (...args: any[]) => any

export class Task {
  constructor(
    public fn: AnyFn,
    public args: any[] = []
  ) {}

  async execute() {
    EventLoop.callStack.push(this)
    EventLoop.taskBeingProcessed.value = this

    await new Promise(resolve => {
      setTimeout(async () => {
        await this.fn(...this.args)
  
        EventLoop.taskBeingProcessed.value = null
        await EventLoop.callStack.pop()

        resolve(void 0)
      }, 10000)
    })
  }

  toString() {
    const prettyPrintArgs = () => (
      this.args.map(arg => JSON.stringify(arg)).join(', ')
    )

    return `${this.fn.name}(${prettyPrintArgs()})`
  }
}

// Last In First Out
export class CallStack {
  name = 'CallStack'
  tasks: Task[] = shallowReactive([])

  push(task: Task) {
    this.tasks.push(task)
  }

  async pop() {
    this.tasks.pop()

    if (this.tasks.length) {
      return
    }

    if (!EventLoop.microTasks.isEmpty) {
      return EventLoop.microTasks.dequeue()
    }
    
    if (!EventLoop.macroTasks.isEmpty) {
      return EventLoop.macroTasks.dequeue()
    }
  }
}

// First In First Out
export class TaskQueue {
  tasks: Task[] = shallowReactive([])

  constructor(
    public name: string
  ) {}

  get isEmpty() {
    return !this.tasks.length
  }

  enqueue(task: Task) {
    this.tasks.push(task)
  }

  async dequeue() {
    const nextTask = this.tasks.shift()

    return nextTask?.execute()
  }
}

export class EventLoop {
  static taskBeingProcessed = ref<Task | null>(null)

  static callStack = new CallStack()

  static microTasks = new TaskQueue('MicroTask')
  static macroTasks = new TaskQueue('MacroTask')

  static get orderedStacks() {
    return [
      this.callStack,
      this.microTasks,
      this.macroTasks
    ]
  }

  static queueEvent(fn: AnyFn, args?: any[]) {
    const task = new Task(fn, args)

    return task.execute()
  }

  static queueMicrotask(fn: AnyFn, args?: any[]) {
    this.microTasks.enqueue(
      new Task(fn, args)
    )
  }

  static queueMacrotask(fn: AnyFn, args?: any[]) {
    this.macroTasks.enqueue(
      new Task(fn, args)
    )
  }
}
