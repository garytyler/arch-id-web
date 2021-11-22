// export const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;
// export const SITE_DOMAIN = process.env.REACT_APP_SITE_DOMAIN;
// export const PROJECT_TITLE = process.env.REACT_APP_PROJECT_TITLE;
// export const PROJECT_DESCRIPTION = process.env.REACT_APP_PROJECT_DESCRIPTION;
// export const PROJECT_GITHUB_URL = process.env.REACT_APP_PROJECT_GITHUB_URL;
// export const TENSORBOARD_URL = process.env.REACT_APP_TENSORBOARD_URL;
// export const AUTHOR_NAME = process.env.REACT_APP_AUTHOR_NAME;
// export const AUTHOR_URL = process.env.REACT_APP_AUTHOR_URL;

export const PREDICT_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.architectureid.ai"
    : "http://localhost:8000";

export const SITE_DOMAIN = "architectureid.ai";
export const PROJECT_GITHUB_URL = "https://github.com/garytyler/arch-id-web";
export const AUTHOR_NAME = "Gary Tyler";
export const AUTHOR_URL = "https://github.com/garytyler";
export const TENSORBOARD_URL =
  "https://tensorboard.dev/experiment/4z5wnrlhRXCDTOWafbV1lw/#scalars";
