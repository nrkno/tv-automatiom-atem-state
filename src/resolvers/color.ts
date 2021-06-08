import { ColorGeneratorState, Commands as AtemCommands } from 'atem-connection'
import { PartialDeep } from 'type-fest'
import { State as StateObject } from '../state'
import * as Defaults from '../defaults'
import { diffObject, fillDefaults, getAllKeysNumber } from '../util'

export function resolveColorState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState.colorGenerators, newState.colorGenerators)) {
		const newColor = fillDefaults(Defaults.ColorGenerator, newState.colorGenerators?.[index])
		const oldColor = fillDefaults(Defaults.ColorGenerator, oldState.colorGenerators?.[index])

		const props = diffObject<ColorGeneratorState>(oldColor, newColor)
		const command = new AtemCommands.ColorGeneratorCommand(index)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}
