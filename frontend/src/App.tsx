import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Link,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { blue, pink } from "@material-ui/core/colors";
import { createTheme, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { default as React } from "react";
import { TENSORBOARD_URL } from "./environment";
import Predictor from "./Predictor";

const useStyles = makeStyles(
  (theme: {
    spacing: (
      arg0: number,
      arg1?: number | undefined,
      arg2?: number | undefined
    ) => number;
    breakpoints: { up: (arg0: number) => any };
  }) => ({
    root: {},
    appBar: {
      position: "relative",
    },
    content: {
      flexGrow: 1,
      overflow: "auto",
    },
    title: {
      flexGrow: 1,
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
            <Box className={classes.title}>
              <Typography variant="h6" color="inherit" noWrap component="span">
                <Link
                  href={`${window.location.protocol}://${window.location.hostname}`}
                  color="inherit"
                  style={{ textDecoration: "none" }}
                >
                  Architecture
                  <Typography
                    variant="h6"
                    color="secondary"
                    noWrap
                    component="span"
                    style={{ fontWeight: 900 }}
                  >
                    ID
                  </Typography>
                  .ai
                </Link>
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Deep learning for architectural style identification
              </Typography>
            </Box>
            <Box marginLeft={1} component="span">
              <Link
                href={TENSORBOARD_URL}
                target="_blank"
                variant="inherit"
                rel="noopener"
              >
                <Button
                  variant="text"
                  color="primary"
                  component="span"
                  size="small"
                >
                  Tensorboard
                </Button>
              </Link>
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
