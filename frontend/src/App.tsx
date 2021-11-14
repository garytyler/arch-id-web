import {
  AppBar,
  Box,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { createTheme, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { default as React } from "react";
import { APP_DESCRIPTION, APP_TITLE } from "./env";
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
  })
);

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
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
            <Box>
              <Typography variant="h6" color="inherit" noWrap>
                {APP_TITLE}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {APP_DESCRIPTION}
              </Typography>
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
