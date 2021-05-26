import { makeStyles } from "@material-ui/core/styles";

const useThemeSectionStyles = makeStyles((theme) => ({
  themeSection_title: {
    marginTop: theme.spacing(2),
  },
  themeSection_bottomLabel: {
    marginBottom: theme.spacing(2),
  },
}));

export default useThemeSectionStyles;
