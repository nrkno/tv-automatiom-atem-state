import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { diffObject, fillDefaults } from '../../util'
import * as Defaults from '../../defaults'
import { PartialDeep } from 'type-fest'

export function resolveChromaKeyerState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldKeyer: PartialDeep<VideoState.USK.UpstreamKeyer>,
	newKeyer: PartialDeep<VideoState.USK.UpstreamKeyer>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.chromaSettings && !newKeyer.chromaSettings) return commands

	const oldChromaKeyer = fillDefaults(Defaults.Video.UpstreamKeyerChromaSettings, oldKeyer.chromaSettings)
	const newChromaKeyer = fillDefaults(Defaults.Video.UpstreamKeyerChromaSettings, newKeyer.chromaSettings)

	const props = diffObject(oldChromaKeyer, newChromaKeyer)
	const command = new AtemCommands.MixEffectKeyChromaCommand(mixEffectId, upstreamKeyerId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}

export function resolveAdvancedChromaKeyerState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldKeyer: PartialDeep<VideoState.USK.UpstreamKeyer>,
	newKeyer: PartialDeep<VideoState.USK.UpstreamKeyer>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.advancedChromaSettings && !newKeyer.advancedChromaSettings) return commands

	{
		const oldProperties = fillDefaults(
			Defaults.Video.UpstreamKeyerAdvancedChromaProperties,
			oldKeyer.advancedChromaSettings?.properties
		)
		const newProperties = fillDefaults(
			Defaults.Video.UpstreamKeyerAdvancedChromaProperties,
			newKeyer.advancedChromaSettings?.properties
		)

		const props = diffObject(oldProperties, newProperties)
		const command = new AtemCommands.MixEffectKeyAdvancedChromaPropertiesCommand(mixEffectId, upstreamKeyerId)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}
	{
		const oldProperties = fillDefaults(
			Defaults.Video.UpstreamKeyerAdvancedChromaSample,
			oldKeyer.advancedChromaSettings?.sample
		)
		const newProperties = fillDefaults(
			Defaults.Video.UpstreamKeyerAdvancedChromaSample,
			newKeyer.advancedChromaSettings?.sample
		)

		const props = diffObject(oldProperties, newProperties)
		const command = new AtemCommands.MixEffectKeyAdvancedChromaSampleCommand(mixEffectId, upstreamKeyerId)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}
