<template>
    <Page>
        <ActionBar :title="title">
            <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="onNavigationButtonTap"></NavigationButton>
        </ActionBar>
        <StackLayout>
        <Button text="Speak This" tap="{{ speakThis }}" class="btn btn-primary" />

        <StackLayout class="input-field">
            <Label text="Enter text:" class="label"></Label>
            <TextView text="{{ speakText }}" hint="Enter the text to speak..." editable="true" class="input input-border"></TextView>
        </StackLayout>

        <Button text="Pause" tap="{{ pauseSynthesizer }}" class="btn btn-primary" />
        <Button text="Resume" tap="{{ resumeSynthesizer }}" class="btn btn-primary" />
        <Button text="Destroy Synthesizer" tap="{{ byebyeSynthesizer }}" class="btn btn-danger" />
    </StackLayout>
    </Page>
</template>

<script lang="ts">
import * as frameModule from '@nativescript/core/ui/frame';
import Vue from 'vue';
import { SpeakOptions, TNSTextToSpeech } from '@nativescript-community/texttospeech';

export const title = 'TextToSpeech sample';



export default Vue.extend({
    data() {
        return {
            title: title,
            _SpeechSynthesizer: null
        };
    },
    methods: {
         async speakThis() {
                if (!this._SpeechSynthesizer) {
                    this._SpeechSynthesizer = new TNSTextToSpeech();
                }

                const opts: SpeakOptions = {
                    text: this.get('speakText'),
                    speakRate: __IOS__ ? 0.45 : null,
                    finishedCallback: () => {
                        alert('Finished Speaking :)');
                    },
                };
        try {
            await this._SpeechSynthesizer.speak(opts);
        } catch (err) {
            alert(err);
        }
    },

     byebyeSynthesizer() {
        this._SpeechSynthesizer.pause();
        this._SpeechSynthesizer.destroy();
        console.log('destroyed');
    },

     pauseSynthesizer() {
        this._SpeechSynthesizer.pause();
        console.log('paused speech');
    },

     resumeSynthesizer() {
        this._SpeechSynthesizer.resume();
        console.log('resumed speech');
    }
    },
    created() {
        console.log('listView sample created');
    },
    beforeDestroy() {}
});
</script>