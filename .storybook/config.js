import { configure, addDecorator } from '@storybook/vue';

import vuetify from '../src/plugins/vuetify-storybook';

addDecorator(() => ({
  vuetify,
  template: `
    <v-app>
      <story/>
    </v-app>
  `,
}))

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /\.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
