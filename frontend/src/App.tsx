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
import { ReactComponent as GitHubLogo } from "./github-icon.svg";
import Predictor from "./Predictor";
import { ReactComponent as TensorboardLogo } from "./tensorboard-icon.svg";

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
    subTitle: {},
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
        <AppBar
          color="default"
          position="absolute"
          className={classes.appBar}
          elevation={8}
        >
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

                <br />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  className={classes.subTitle}
                >
                  Identify architectural style with deep learning
                </Typography>
              </Link>
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
                <SvgIcon>
                  <TensorboardLogo />
                </SvgIcon>
              </IconButton>
              <IconButton
                edge="end"
                className={classes.iconButton}
                href={PROJECT_GITHUB_URL}
                target="_blank"
                rel="noopener"
              >
                <SvgIcon>
                  <GitHubLogo style={{ fillRule: "evenodd" }} />
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
