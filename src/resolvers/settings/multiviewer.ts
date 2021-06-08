import { SettingsState, Commands as AtemCommands } from 'atem-connection'
import { PartialDeep } from 'type-fest'
import { State as StateObject } from '../../state'
import * as Defaults from '../../defaults'
import { diffObject, fillDefaults, getAllKeysNumber } from '../../util'

export function resolveMultiviewerState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState.settings?.multiViewers, newState.settings?.multiViewers)) {
		const newMv = newState.settings?.multiViewers?.[index]
		const oldMv = oldState.settings?.multiViewers?.[index]

		commands.push(...resolveMultiviewerWindowsState(index, oldMv, newMv))

		const newProps = fillDefaults(Defaults.Multiviewer.Properties, newMv?.properties)
		const oldProps = fillDefaults(Defaults.Multiviewer.Properties, oldMv?.properties)

		const props = diffObject<SettingsState.MultiViewerPropertiesState>(oldProps, newProps)
		const command = new AtemCommands.MultiViewerPropertiesCommand(index)
		if (command.updateProps(props)) {
			commands.push(command)
		}

		const oldVuOpacity = oldMv?.vuOpacity ?? Defaults.Multiviewer.VuOpacity
		const newVuOpacity = newMv?.vuOpacity ?? Defaults.Multiviewer.VuOpacity
		if (oldVuOpacity !== newVuOpacity) {
			commands.push(new AtemCommands.MultiViewerVuOpacityCommand(index, newVuOpacity))
		}
	}

	return commands
}

export function resolveMultiviewerWindowsState(
	index: number,
	oldMv: PartialDeep<SettingsState.MultiViewer> | undefined,
	newMv: PartialDeep<SettingsState.MultiViewer> | undefined
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const window of getAllKeysNumber(oldMv?.windows, newMv?.windows)) {
		const oldWindow = oldMv?.windows?.[window]
		const newWindow = newMv?.windows?.[window]

		const oldSource = oldWindow?.source ?? 0
		const newSource = newWindow?.source ?? 0
		if (oldSource !== newSource) {
			commands.push(new AtemCommands.MultiViewerSourceCommand(index, window, newSource))
		}

		const oldSafeArea = oldWindow?.safeTitle ?? false
		const newSafeArea = newWindow?.safeTitle ?? false
		if (oldSafeArea !== newSafeArea) {
			commands.push(new AtemCommands.MultiViewerWindowSafeAreaCommand(index, window, newSafeArea))
		}

		const oldAudioMeter = oldWindow?.audioMeter ?? false
		const newAudioMeter = newWindow?.audioMeter ?? false
		if (oldAudioMeter !== newAudioMeter) {
			commands.push(new AtemCommands.MultiViewerWindowVuMeterCommand(index, window, newAudioMeter))
		}
	}

	return commands
}
