import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { diffObject, fillDefaults, getAllKeysNumber } from '../../util'
import * as Defaults from '../../defaults'
import { PartialDeep } from 'type-fest'

export function resolveFlyKeyerState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldKeyer: PartialDeep<VideoState.USK.UpstreamKeyer>,
	newKeyer: PartialDeep<VideoState.USK.UpstreamKeyer>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldKeyer.flyKeyframes, newKeyer.flyKeyframes)) {
		const newKeyframe = fillDefaults(Defaults.Video.flyKeyframe(index), oldKeyer.flyKeyframes?.[index])
		const oldKeyframe = fillDefaults(Defaults.Video.flyKeyframe(index), newKeyer.flyKeyframes?.[index])

		const props = diffObject(oldKeyframe, newKeyframe)
		const command = new AtemCommands.MixEffectKeyFlyKeyframeCommand(mixEffectId, upstreamKeyerId, index)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}
