import RuX from '../src/index'

const logs = () => (next: any) => (...args: any) => {
	next(...args)
}
const logs1 = () => (next: any) => (...args: any) => {
	next(...args)
}
describe('Rux测试', () => {
	let getState: any
	let dispatch: any
	let commit: any
	// let useStore: any

	beforeEach(() => {
		const rux = RuX({
			state: {
				count: 1,
			},
			mutations: {
				increment(state, payload = 1) {
					state.count += payload
				},
				decrement(state, payload = 1) {
					state.count -= payload
				},
			},
			actions: {
				async asyncIncrement(commit) {
					await new Promise(resolve => {
						setTimeout(() => {
							resolve()
						}, 200)
					})
					return commit('increment', 100)
				},
				async asyncDecrement(commit) {
					await new Promise(resolve => {
						setTimeout(() => {
							resolve()
						}, 200)
					})
					commit('decrement', 99)
				},
			},
			plugins: [logs, logs1],
		})
		getState = rux.getState
		dispatch = rux.dispatch
		commit = rux.commit
		// useStore = rux.useStore
	})

	describe('getState 获取store数据', () => {
		test('getState无参数场景,返回默认state,结果返回{count:1}', () => {
			expect(getState()).toEqual({ count: 1 })
		})
		test(`getState传入state过滤器,结果返回{count:2}`, () => {
			expect(
				getState((state: any) => {
					state.count++
					return state.count
				}),
			).toBe(2)
		})
	})

	describe(`dispacth 更新store数据`, () => {
		test(`commit("increment",9) 同步更新数据,结果返回10`, () => {
			commit('increment', 9)
			expect(getState()).toEqual({ count: 10 })
		})
		test(`dispacth("increment",9) 同步更新数据,结果返回10`, done => {
			dispatch('increment', 9).then(() => {
				expect(getState()).toEqual({ count: 10 })
				done()
			})
		})

		test('dispacth("asyncDecrement") 异步获取,通过getState 进行获取', done => {
			dispatch('asyncDecrement').then((rres: any) => {
				expect(rres).toBeUndefined()
				expect(getState().count).not.toBe(-99)
				expect(getState().count).toBe(-98)
				done()
			})
		})
	})
})

// describe(`react 实践'`, () => {
//   // jest.spyOn(React,'useEffect').mockImplementation(React.useLayoutEffect)
// 	// const { useStore, dispatch } = RuX({
// 	// 	state: {
// 	// 		count: 1,
// 	// 	},
// 	// 	mutations: {
// 	// 		increment(state, payload = 1) {
// 	// 			state.count += payload
// 	// 		},
// 	// 		decrement(state, payload = 1) {
// 	// 			state.count -= payload
// 	// 		},
// 	// 	},
// 	// 	actions: {
// 	// 		async asyncIncrement(commit) {
// 	// 			await new Promise(resolve => {
// 	// 				setTimeout(() => {
// 	// 					resolve()
// 	// 				}, 200)
// 	// 			})
// 	// 			return commit('increment', 100)
// 	// 		},
// 	// 		async asyncDecrement(commit) {
// 	// 			await new Promise(resolve => {
// 	// 				setTimeout(() => {
// 	// 					resolve()
// 	// 				}, 200)
// 	// 			})
// 	// 			commit('decrement', 99)
// 	// 		},
// 	// 	},
// 	// })
// 	const App = () => {
// 		// const count = useStore((state: any) => state.count)
// 		const [count, setCount] = useState<number>(1)
// 		useLayoutEffect(() => {
// 			console.log('useEffect----------------------')
// 		}, [])
// 		const increment = () => {
// 			// dispatch('increment', 2)
// 			setCount(count + 1)
// 		}
// 		const decrement = () => {
// 			// dispatch('decrement', count - 1)
// 			// setCount(count - 1)
// 		}
// 		const asyncIncrement = () => {
// 			// dispatch('asyncIncrement')
// 		}
// 		return (
// 			<div>
// 				<p>{count}</p>
// 				<button className="increment" onClick={increment}>
// 					+
// 				</button>
// 				<button className="decrement" onClick={decrement}>
// 					-
// 				</button>
// 				<button className="asyncIncrement" onClick={asyncIncrement}>
// 					async+
// 				</button>
// 			</div>
// 		)
// 	}
// 	test('render <App /> components', () => {
// 		const wapper = shallow(<App />)
// 		expect(wapper.find('p').text()).toEqual('1')
// 	})
// 	test('click  + ', () => {
// 		const wapper = shallow(<App />)
// 		wapper.find('.increment').simulate('click')
// 		console.log(wapper.find('p').text())
// 		setTimeout(() => {
// 			console.log(wapper.find('p').text())
// 		}, 400)
// 		// expect(wapper.find('p').text()).toEqual('2')
// 	})
// 	// test('click  - ', () => {
// 	// 	const wapper = shallow(<App />)
// 	// 	wapper.find('.decrement').simulate('click')
// 	// 	expect(wapper.find('p').text()).toEqual('0')
// 	// })
// 	// test('click  async+ ', () => {

// 	// })
// })
