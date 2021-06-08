import { ConstellationState } from './states/constellation'
import { Legacy2MEState } from './states/2me'
import * as objectPath from 'object-path'
import clone = require('fast-clone')
import { AtemState } from '..'
import { AtemState as ConnectionState } from 'atem-connection'

/**
 * This file contains some 'automated' generated tests.
 *
 * The aim is to ensure that doing a diffStates on two partial states does not error.
 * We do this by randomly picking some keys (doing them all every time is too slow), and deleting them from the state object.
 * Then we run the diff against that and the original in different ways. If it doesnt error, that is good enough
 */

function getAllPathKeys(state: any): string[] {
	const keys: string[] = []
	if (state && typeof state === 'object') {
		for (const [k, o] of Object.entries(state)) {
			if (o) {
				keys.push(k)
				const childKeys = getAllPathKeys(o)
				keys.push(...childKeys.map((c) => `${k}.${c}`))
			}
		}
	} else if (Array.isArray(state)) {
		state.forEach((o, i) => {
			if (o) {
				keys.push(i + '')
				const childKeys = getAllPathKeys(o)
				keys.push(...childKeys.map((c) => `${i}.${c}`))
			}
		})
	}
	return keys
}

function runPartialStateTest(rawState: ConnectionState, iterations: number) {
	describe(`Partial state: ${rawState.info.productIdentifier}`, function () {
		const allPathKeys = getAllPathKeys(rawState)
		expect(allPathKeys.length).not.toBe(0)

		test('Matching state', function () {
			// State to itself should be completely happy
			expect(() => AtemState.diffStates(rawState.info.apiVersion, rawState, rawState)).not.toThrow()
		})

		for (let i = 0; i < iterations; i++) {
			const index = Math.floor(Math.random() * allPathKeys.length)
			allPathKeys.splice(index, 1)
			const key = allPathKeys[index]
			test(`Unit test: ${key}`, function () {
				// expect(key).toBeTruthy()
				expect(objectPath.get(rawState, key)).toBeDefined()

				const stateModded = clone(rawState)
				objectPath.del(stateModded, key)

				// try diffing one way
				expect(() => AtemState.diffStates(rawState.info.apiVersion, rawState, stateModded)).not.toThrow()

				// and back the other
				expect(() => AtemState.diffStates(rawState.info.apiVersion, stateModded, rawState)).not.toThrow()

				expect(() => AtemState.diffStates(rawState.info.apiVersion, stateModded, stateModded)).not.toThrow()
			})
		}
	})
}

runPartialStateTest(ConstellationState, 200)
runPartialStateTest(Legacy2MEState, 100)

test(`Cross-device diffs`, function () {
	expect(() =>
		AtemState.diffStates(ConstellationState.info.apiVersion, ConstellationState, Legacy2MEState)
	).not.toThrow()

	expect(() => AtemState.diffStates(Legacy2MEState.info.apiVersion, Legacy2MEState, ConstellationState)).not.toThrow()
})
