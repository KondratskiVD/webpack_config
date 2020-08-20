async function start() {
  return await Promise.resolve('async is working')
}

start().then(console.log)

class Util { //синтаксис как предложение, babel не понимает его без плагинов
  static id = Date.now()
}

console.log('Util id: ', Util.id)