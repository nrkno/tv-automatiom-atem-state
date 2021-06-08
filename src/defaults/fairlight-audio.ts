import { Enums, Fairlight } from 'atem-connection'

export const Master: Fairlight.FairlightAudioMasterChannelPropertiesState = {
	faderGain: 0,
	followFadeToBlack: false,
}

export const Equalizer: Fairlight.FairlightAudioEqualizerState = {
	enabled: false,
	gain: 0,
	bands: [],
}

export const Monitor: Fairlight.FairlightAudioMonitorChannel = {
	gain: 0,
	inputMasterGain: 0,
	inputTalkbackGain: 0,
	inputSidetoneGain: 0,
}

export const Dynamics: Required<Omit<Fairlight.FairlightAudioDynamicsState, 'compressor' | 'limiter' | 'expander'>> = {
	makeUpGain: 0,
}

export const DynamicsLimiter: Fairlight.FairlightAudioLimiterState = {
	limiterEnabled: false,
	threshold: 0,
	attack: 0,
	hold: 0,
	release: 0,
}

export const DynamicsExpander: Fairlight.FairlightAudioExpanderState = {
	expanderEnabled: false,
	gateEnabled: false,
	threshold: 0,
	range: 0,
	ratio: 0,
	attack: 0,
	hold: 0,
	release: 0,
}

export const DynamicsCompressor: Fairlight.FairlightAudioCompressorState = {
	compressorEnabled: false,
	threshold: 0,
	ratio: 0,
	attack: 0,
	hold: 0,
	release: 0,
}

export const DynamicsEqualizerBand: Fairlight.FairlightAudioEqualizerBandState = {
	bandEnabled: false,
	supportedShapes: [],
	shape: 0,
	supportedFrequencyRanges: [],
	frequencyRange: 0,
	frequency: 0,
	gain: 0,
	qFactor: 0,
}

export const InputProperties: Fairlight.FairlightAudioInputProperties = {
	inputType: Enums.FairlightInputType.EmbeddedWithVideo,
	externalPortType: Enums.ExternalPortType.SDI,
	supportedConfigurations: [],
	activeConfiguration: Enums.FairlightInputConfiguration.Stereo,
	supportedInputLevels: [],
	activeInputLevel: Enums.FairlightAnalogInputLevel.ProLine,
}

export const SourceProperties: Fairlight.FairlightAudioSourcePropertiesState = {
	sourceType: Enums.FairlightAudioSourceType.Stereo,
	maxFramesDelay: 0,
	framesDelay: 0,
	hasStereoSimulation: false,
	stereoSimulation: 0,
	gain: 0,
	balance: 0,
	faderGain: 0,
	supportedMixOptions: [],
	mixOption: Enums.FairlightAudioMixOption.Off,
}
