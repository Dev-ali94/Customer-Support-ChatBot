import { ScalekitClient } from '@scalekit-sdk/node';

const scalekit = new ScalekitClient(
    process.env.SCALEKIT_ENVIRONMENT_URL,
    process.env.SCALEKIT_CLIENT_ID,
    process.env.SCALEKIT_CLIENT_SECRET,
);

export default scalekit