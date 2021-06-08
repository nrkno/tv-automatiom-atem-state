import { Commands as AtemCommands, VideoState } from 'atem-connection'

import { resolveDVEKeyerState } from './dveKeyer'
import { resolveAdvancedChromaKeyerState, resolveChromaKeyerState } from './chromaKeyer'
import { resolveLumaKeyerState } from './lumaKeyer'
import { resolvePatternKeyerState } from './patternKeyer'
import { getAllKeysNumber, diffObject, fillDefaults } from '../../util'
import { ExtendedMixEffect } from '../../state'
import { PartialDeep } from 'type-fest'
import * as Defaults from '../../defaults'
import { resolveFlyKeyerState } from './flyKey'

export function resolveUpstreamKeyerState(
	mixEffectId: number,
	oldMixEffect: PartialDeep<VideoState.MixEffect> | PartialDeep<ExtendedMixEffect> | undefined,
	newMixEffect: PartialDeep<VideoState.MixEffect> | PartialDeep<ExtendedMixEffect> | undefined
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const upstreamKeyerId of getAllKeysNumber(oldMixEffect?.upstreamKeyers, newMixEffect?.upstreamKeyers)) {
		const oldKeyer = fillDefaults(
			Defaults.Video.UpstreamKeyer(upstreamKeyerId),
			oldMixEffect?.upstreamKeyers?.[upstreamKeyerId]
		)
		const newKeyer = fillDefaults(
			Defaults.Video.UpstreamKeyer(upstreamKeyerId),
			newMixEffect?.upstreamKeyers?.[upstreamKeyerId]
		)

		commands.push(...resolveUpstreamKeyerMaskState(mixEffectId, upstreamKeyerId, oldKeyer, newKeyer))
		commands.push(...resolveDVEKeyerState(mixEffectId, upstreamKeyerId, oldKeyer, newKeyer))
		commands.push(...resolveFlyKeyerState(mixEffectId, upstreamKeyerId, oldKeyer, newKeyer))
		commands.push(...resolveChromaKeyerState(mixEffectId, upstreamKeyerId, oldKeyer, newKeyer))
		commands.push(...resolveAdvancedChromaKeyerState(mixEffectId, upstreamKeyerId, oldKeyer, newKeyer))
		commands.push(...resolveLumaKeyerState(mixEffectId, upstreamKeyerId, oldKeyer, newKeyer))
		commands.push(...resolvePatternKeyerState(mixEffectId, upstreamKeyerId, oldKeyer, newKeyer))

		if (oldKeyer.fillSource !== newKeyer.fillSource) {
			commands.push(
				new AtemCommands.MixEffectKeyFillSourceSetCommand(mixEffectId, upstreamKeyerId, newKeyer.fillSource)
			)
		}
		if (oldKeyer.cutSource !== newKeyer.cutSource) {
			commands.push(new AtemCommands.MixEffectKeyCutSourceSetCommand(mixEffectId, upstreamKeyerId, newKeyer.cutSource))
		}

		const typeProps = diffObject(oldKeyer, newKeyer)
		const command = new AtemCommands.MixEffectKeyTypeSetCommand(mixEffectId, upstreamKeyerId)
		if (command.updateProps(typeProps)) {
			commands.push(command)
		}

		if (oldKeyer.onAir !== newKeyer.onAir) {
			commands.push(new AtemCommands.MixEffectKeyOnAirCommand(mixEffectId, upstreamKeyerId, newKeyer.onAir))
		}
	}

	return commands
}

export function resolveUpstreamKeyerMaskState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldKeyer: PartialDeep<VideoState.USK.UpstreamKeyer>,
	newKeyer: PartialDeep<VideoState.USK.UpstreamKeyer>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	const oldMask = fillDefaults(Defaults.Video.UpstreamKeyerMask, oldKeyer.maskSettings)
	const newMask = fillDefaults(Defaults.Video.UpstreamKeyerMask, newKeyer.maskSettings)

	const props = diffObject<VideoState.USK.UpstreamKeyerMaskSettings>(oldMask, newMask)

	const command = new AtemCommands.MixEffectKeyMaskSetCommand(mixEffectId, upstreamKeyerId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}
