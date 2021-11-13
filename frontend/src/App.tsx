import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Link,
  Paper,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { createTheme, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { default as React } from "react";
import { APP_DESCRIPTION, APP_TITLE, AUTHOR_NAME, AUTHOR_URL } from "./env";
import Predictor from "./Predictor";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href={AUTHOR_URL}>
        {AUTHOR_NAME}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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
    layout: {
      width: "auto",
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
        width: 600,
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
    container: {
      paddingBottom: theme.spacing(4),
      [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
        paddingTop: theme.spacing(4),
      },
    },
    paper: {
      elevation: 6,
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        padding: theme.spacing(3),
      },
    },
    stepper: {
      padding: theme.spacing(3, 0, 5),
    },
    buttons: {
      display: "flex",
      justifyContent: "flex-end",
    },
    button: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(1),
    },
    content: {
      flexGrow: 1,
      height: "100vh",
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
            <Box marginY={1}>
              <Typography variant="h6" color="inherit" noWrap>
                {APP_TITLE}
                <Typography variant="subtitle2" color="textSecondary">
                  {APP_DESCRIPTION}
                </Typography>
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <Container className={classes.container}>
            <Paper className={classes.paper}>
              <Box textAlign="center">
                <Predictor />
              </Box>
            </Paper>
            <Copyright />
          </Container>
        </main>
      </ThemeProvider>
    </div>
  );
}
