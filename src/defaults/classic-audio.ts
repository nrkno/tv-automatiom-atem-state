import { AudioState } from 'atem-connection'

export const Channel: AudioState.ClassicAudioChannel = {
	sourceType: 0,
	portType: 1,
	mixOption: 0,
	gain: 0,
	balance: 0,
	supportsRcaToXlrEnabled: false,
	rcaToXlrEnabled: false,
}
export const Master: AudioState.ClassicAudioMasterChannel = {
	gain: 0,
	balance: 0,
	followFadeToBlack: false,
}

export const Monitor: AudioState.ClassicAudioMonitorChannel = {
	enabled: false,
	gain: 0,
	mute: false,
	solo: false,
	soloSource: 0,
	dim: false,
	dimLevel: 0,
}

export const Headphones: AudioState.ClassicAudioHeadphoneOutputChannel = {
	gain: 0,
	programOutGain: 0,
	sidetoneGain: 0,
	talkbackGain: 0,
}
