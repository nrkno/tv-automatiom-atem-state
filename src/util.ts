import { PartialDeep } from 'type-fest'
import * as deepMerge from 'deepmerge'
import { PartialObjectDeep } from 'type-fest/source/partial-deep'

export function diffObject<T>(oldObj: Partial<T>, newObj: Partial<T>): Partial<T> {
	const diff: Partial<T> = {}
	for (const key in newObj) {
		const typedKey = key as keyof T
		if (newObj[typedKey] && oldObj[typedKey] && Array.isArray(newObj[typedKey]) && Array.isArray(oldObj[typedKey])) {
			// We need to compare array contents, not the arrays themselves

			const newArr: any[] = newObj[typedKey] as any
			const oldArr: any[] = oldObj[typedKey] as any
			newArr.sort()
			oldArr.sort()

			if (newArr.length !== oldArr.length || !newArr.every((val, index) => val === oldArr[index])) {
				diff[typedKey] = newObj[typedKey]
			}
		} else if (newObj[typedKey] !== oldObj[typedKey]) {
			diff[typedKey] = newObj[typedKey]
		}
	}

	return diff
}

function keyIsValid(key: string, oldObj: any, newObj: any) {
	const oldVal = oldObj[key]
	const newVal = newObj[key]
	return (oldVal !== undefined && oldVal !== null) || (newVal !== undefined && newVal !== null)
}

export function getAllKeysString<V>(
	oldObj0: { [key: string]: V } | undefined,
	newObj0: { [key: string]: V } | undefined
): string[] {
	const oldObj = oldObj0 ?? {}
	const newObj = newObj0 ?? {}
	const rawKeys = Object.keys(oldObj).concat(Object.keys(newObj))
	return rawKeys.filter((v, i) => keyIsValid(v, oldObj, newObj) && rawKeys.indexOf(v) === i)
}
export function getAllKeysNumber<V>(
	oldObj0: { [key: number]: V } | Array<V> | undefined,
	newObj0: { [key: number]: V } | Array<V> | undefined
): number[] {
	const oldObj = oldObj0 ?? []
	const newObj = newObj0 ?? []
	const rawKeys = Object.keys(oldObj).concat(Object.keys(newObj))
	return rawKeys.filter((v, i) => keyIsValid(v, oldObj, newObj) && rawKeys.indexOf(v) === i).map((v) => parseInt(v, 10))
}

export function jsonClone<T>(src: T): T {
	return JSON.parse(JSON.stringify(src))
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function fillDefaults<T extends object>(defaults: T, val: PartialDeep<T> | PartialObjectDeep<T> | undefined): T {
	return deepMerge(defaults, (val ?? {}) as Partial<T>, { arrayMerge: (_dest, src) => src })
}
