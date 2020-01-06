import { useState, useEffect } from 'react'
import equal from 'fast-deep-equal'
import produce from 'immer'

interface IOption<S, M, A> {
	state: S
	mutations?: M
	actions?: A
	plugins?: any[]
}
interface IMutations<S> {
	[key: string]: TReducer<S>
}
interface IActions {
	[key: string]: (dispatch: TDispatch, payload?: any) => any
}
interface IUpdater<S> {
	update: (set: any, oldState: S, nextState: S) => any
	set: any
}
type TDispatch = (type: string, payload?: any) => any
type TReducer<S> = (state: S, payload?: any) => any
type TStateSelector<T, P> = (state: T) => P
// type TMorph<A, B> = (arg: A) => B

function compose(funs: any[]) {
	if (!funs.length) {
		return (args: any) => args
	}
	if (funs.length === 0) {
		return funs[0]
	}
	return funs.reduce((a, b) => {
		return (...args: any) => a(b(...args))
	})
}

export default function RuX<S, M extends IMutations<S>, A extends IActions>(
	option: IOption<S, M, A>,
) {
	let curretState = option.state
	const mutations = option.mutations
	const actions = option.actions
	const plugins = option.plugins
	const updates: IUpdater<S>[] = []

	function useStore<P>(selector: TStateSelector<S, P> = () => curretState as any) {
		const [state, setState] = useState(() => {
			return selector(curretState)
    })
		function update(set: any, oldState: S, nextState: S) {
      const shouldUpdate = !equal(selector(oldState), selector(nextState))
			if (shouldUpdate) {
        set(() => selector(nextState))
			}
		}
		const updater = {
			update,
			set: setState,
		}
		useEffect(() => {
			updates.push(updater)
			return () => {
				updates.splice(updates.indexOf(updater), 1)
			}
		}, [])
		return state
	}
	function getState<P>(selector?: TStateSelector<S, P>) {
		return selector ? selector(curretState) : curretState
	}
	let commit = (action: string, payload: any) => {
		//mutations 处理
		if (mutations && mutations[action]) {
			const newState = produce<S, S>(curretState, draftState => {
				mutations[action](draftState, payload)
				return draftState
      })
			updates.forEach(updater => {
				updater.update(updater.set, curretState, newState)
			})
			curretState = newState
			return newState
		}
		return null
	}
	const dispatch = async function(action: string, payload: any) {
		// action 不存在场景
		if (!action) {
			return null
		}
		//actions 异步处理
		if (actions && actions[action]) {
			return await actions[action](commit, payload)
		}
		// mutation 同步处理
		return commit(action, payload)
  
		return null
	}
	if (plugins) {
		commit = compose(
			plugins.map(plugin =>
				plugin({
					getState,
					commit,
				}),
			),
		)(commit)
	}

	return {
		dispatch,
		getState,
    useStore,
    commit,
	}
}
