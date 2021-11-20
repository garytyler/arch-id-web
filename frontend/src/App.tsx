import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Link,
  SvgIcon,
  Theme,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { blue, pink } from "@material-ui/core/colors";
import {
  createStyles,
  createTheme,
  makeStyles,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { default as React } from "react";
import { PROJECT_GITHUB_URL, TENSORBOARD_URL } from "./environment";
// import GithubIcon from "./github-icon.svg";
import Predictor from "./Predictor";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    appBar: {
      position: "relative",
    },
    content: {
      flexGrow: 1,
      overflow: "auto",
    },
    titleBox: {
      marginTop: "1em",
      flexGrow: 1,
    },
    title: {
      fontSize: "1.5em",
      fontWeight: 900,
      lineHeight: 0,
    },
    subTitle: {
      // fontSize: "1.5em",
      // fontWeight: 900,
      // lineHeight: 0,
    },
    iconButton: {
      padding: 10,
    },
    cornerMenu: {
      display: "flex",
    },
  })
);

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
          primary: blue,
          secondary: pink,
        },
      }),
    [prefersDarkMode]
  );

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar color="default" position="absolute" className={classes.appBar}>
          <Toolbar>
            <Box className={classes.titleBox}>
              <Link
                href={`${window.location.protocol}://${window.location.hostname}`}
                color="inherit"
                style={{ textDecoration: "none" }}
              >
                <Typography
                  color="inherit"
                  noWrap
                  component="span"
                  className={classes.title}
                >
                  Architecture
                </Typography>
                <Typography
                  color="secondary"
                  noWrap
                  component="span"
                  className={classes.title}
                >
                  <i>ID</i>
                </Typography>
                <Typography
                  color="inherit"
                  noWrap
                  component="span"
                  className={classes.title}
                >
                  .ai
                </Typography>
              </Link>
              <br />
              <Typography
                variant="caption"
                color="textSecondary"
                className={classes.subTitle}
              >
                Identify architectural style with deep learning
              </Typography>
            </Box>
            <Box style={{ display: "flex" }} marginY={0}>
              <IconButton
                className={classes.iconButton}
                style={{ marginRight: 0 }}
                edge="end"
                href={TENSORBOARD_URL}
                target="_blank"
                rel="noopener"
              >
                <SvgIcon
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 48 60"
                >
                  <g>
                    <g>
                      <defs>
                        <path
                          id="SVGID_1_"
                          d="M47.5 17.6L25 4.8v52.6l9-5.2V37.4l6.8 3.9-.1-10.1-6.7-3.9v-5.9l13.5 7.9z"
                        />
                      </defs>
                      <clipPath id="SVGID_2_">
                        <use xlinkHref="#SVGID_1_" overflow="visible" />
                      </clipPath>
                      <g clip-path="url(#SVGID_2_)">
                        <linearGradient
                          id="SVGID_3_"
                          gradientUnits="userSpaceOnUse"
                          x1="-1.6"
                          y1="335.05"
                          x2="53.6"
                          y2="335.05"
                          gradientTransform="translate(0 -304)"
                        >
                          <stop offset="0" stop-color="#ff6f00" />
                          <stop offset="1" stop-color="#ffa800" />
                        </linearGradient>
                        <path
                          d="M-1.6 4.6h55.2v52.9H-1.6V4.6z"
                          fill="url(#SVGID_3_)"
                        />
                      </g>
                    </g>
                  </g>
                  <g>
                    <g>
                      <defs>
                        <path
                          id="SVGID_4_"
                          d="M.5 17.6L23 4.8v52.6l-9-5.2V21.4L.5 29.3z"
                        />
                      </defs>
                      <clipPath id="SVGID_5_">
                        <use xlinkHref="#SVGID_4_" overflow="visible" />
                      </clipPath>
                      <g clip-path="url(#SVGID_5_)">
                        <linearGradient
                          id="SVGID_6_"
                          gradientUnits="userSpaceOnUse"
                          x1="-1.9"
                          y1="335.05"
                          x2="53.3"
                          y2="335.05"
                          gradientTransform="translate(0 -304)"
                        >
                          <stop offset="0" stop-color="#ff6f00" />
                          <stop offset="1" stop-color="#ffa800" />
                        </linearGradient>
                        <path
                          d="M-1.9 4.6h55.2v52.9H-1.9V4.6z"
                          fill="url(#SVGID_6_)"
                        />
                      </g>
                    </g>
                  </g>
                </SvgIcon>
              </IconButton>
              <IconButton
                edge="end"
                className={classes.iconButton}
                href={PROJECT_GITHUB_URL}
                target="_blank"
                rel="noopener"
              >
                <SvgIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path
                    fill-rule="evenodd"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                  ></path>
                </SvgIcon>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <Predictor />
        </main>
      </ThemeProvider>
    </div>
  );
}
