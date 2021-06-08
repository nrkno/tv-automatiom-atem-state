import { Commands as AtemCommands, Enums } from 'atem-connection'
import { State as StateObject } from '../state'

import { resolveMixEffectsState } from './mixEffect'
import { resolveDownstreamKeyerState } from './downstreamKeyer'
import { resolveSuperSourceState } from './supersource'
import { resolveClassicAudioState } from './classic-audio'
import { resolveMacroPlayerState } from './macro'
import { getAllKeysNumber } from '../util'
import { resolveMediaPlayerState } from './media'
import { PartialDeep } from 'type-fest'
import { resolveColorState } from './color'
import { resolveMultiviewerState } from './settings/multiviewer'
import { resolveFairlightAudioState } from './falirlight-audio'

export function videoState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>,
	version: Enums.ProtocolVersion
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	commands.push(...resolveMixEffectsState(oldState, newState))
	commands.push(...resolveMacroPlayerState(oldState, newState))
	commands.push(...resolveDownstreamKeyerState(oldState, newState))
	commands.push(...resolveSuperSourceState(oldState, newState, version))
	commands.push(...resolveClassicAudioState(oldState, newState))
	commands.push(...resolveFairlightAudioState(oldState, newState, version))
	commands.push(...resolveMediaPlayerState(oldState, newState))
	commands.push(...resolveColorState(oldState, newState))
	commands.push(...resolveMultiviewerState(oldState, newState))

	// resolve auxilliaries:
	for (const index of getAllKeysNumber(oldState.video?.auxilliaries, newState.video?.auxilliaries)) {
		const oldSource = oldState.video?.auxilliaries?.[index] ?? 0
		const newSource = newState.video?.auxilliaries?.[index] ?? 0

		if (oldSource !== newSource) {
			commands.push(new AtemCommands.AuxSourceCommand(index, newSource))
		}
	}

	return commands
}
