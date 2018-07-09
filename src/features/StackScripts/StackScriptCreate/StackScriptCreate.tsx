import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { compose, pathOr } from 'ramda';

import {
  StyleRulesCallback,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
// import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { KeyboardArrowLeft } from '@material-ui/icons';

import Grid from 'src/components/Grid';
import HelpIcon from 'src/components/HelpIcon';
import PromiseLoader from 'src/components/PromiseLoader';
import Select from 'src/components/Select';
import TextField from 'src/components/TextField';

import { getLinodeImages } from 'src/services/images';


type ClassNames = 'root'
  | 'backButton'
  | 'titleWrapper'
  | 'createTitle'
  | 'adornment';

const styles: StyleRulesCallback<ClassNames> = (theme: Theme & Linode.Theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  backButton: {
    margin: '5px 0 0 -16px',
    '& svg': {
      width: 34,
      height: 34,
    },
  },
  createTitle: {
    lineHeight: '2.25em'
  },
  titleWrapper: {
    display: 'flex',
    marginTop: 5,
  },
  adornment: {
    fontSize: '.9rem',
    marginLeft: 5,
    color: theme.color.grey1
  },
});

interface Props { 
  profile: Linode.Profile;
}

interface PreloadedProps {
  images: { response: Linode.Image[] }
}

interface State {
  labelText: string;
  descriptionText: string;
  imageSelectOpen: boolean;
  selectedImages: string[];
  availableImages: Linode.Image[];
 }

type CombinedProps = Props
  & WithStyles<ClassNames>
  & PreloadedProps;

const preloaded = PromiseLoader<Props>({
  images: () => getLinodeImages()
    .then(response => response.data || [])
})

export class StackScriptCreate extends React.Component<CombinedProps, State> {
  state: State = {
    labelText: '',
    descriptionText: '',
    imageSelectOpen: false,
    selectedImages: [],
    /* available images to select from in the dropdown */
    availableImages: this.props.images.response,
  };

  handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({labelText: e.target.value});
  }

  handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ descriptionText: e.target.value });
  }

  handleOpenSelect = () => {
    this.setState({ imageSelectOpen: true });
  }

  handleCloseSelect = () => {
    this.setState({ imageSelectOpen: false });
  }

  handleChooseImage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(this.state.selectedImages);
    this.setState({ selectedImages: [...this.state.selectedImages, e.target.value] })
    this.setState({ imageSelectOpen: true });
  }

  render() {
    const { classes, profile, images } = this.props;
    return (
      <React.Fragment>
        <Grid
          container
          justify="space-between"
        >
          <Grid item className={classes.titleWrapper}>
            <Link to={`/stackscripts`}>
              <IconButton
                className={classes.backButton}
              >
                <KeyboardArrowLeft />
              </IconButton>
            </Link>
            <Typography className={classes.createTitle} variant="headline">
              Create New StackScript
      </Typography>
          </Grid>
        </Grid>
        <Paper className={classes.root}>
          <TextField
            InputProps={{
              startAdornment: <span className={classes.adornment}>
                {profile.username} /</span>,
            }}
            // errorText={hasErrorFor('client_conn_throttle')}
            label='StackScript Label'
            required
            onChange={this.handleLabelChange}
            placeholder='Enter a label'
          />
          <HelpIcon text="Select a StackScript Label" />
          <TextField
            multiline
            rows={1}
            label="Description"
            placeholder="Enter a description"
            onChange={this.handleDescriptionChange}
          // errorText={hasErrorFor('ssl_cert')}
          // errorGroup={forEdit ? `${configIdx}`: undefined}
          />
          <HelpIcon text="Give your StackScript a description" />
          <FormControl fullWidth>
            <InputLabel
              htmlFor="image"
              disableAnimation
              shrink={true}
            // error={Boolean(regionError)}
            >
              Target Images
          </InputLabel>
            <Select
              open={this.state.imageSelectOpen}
              onOpen={this.handleOpenSelect}
              onClose={this.handleCloseSelect}
              value='none'
              onChange={this.handleChooseImage}
              inputProps={{ name: 'image', id: 'image' }}
            // error={Boolean(regionError)}
            >
              <MenuItem disabled key="none" value="none">Select Compatible Images</MenuItem>,
            {images && images.response.map(image =>
                <MenuItem
                  key={image.id}
                  value={image.label}
                >
                  {image.label}
              </MenuItem>,
              )}
            </Select>
            {/* {regionError &&
            <FormHelperText error={Boolean(regionError)}>
              {regionError}
            </FormHelperText>
          } */}
          </FormControl>
          <HelpIcon text="Select Multiple Images" />
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: Linode.AppState) => ({
  profile: pathOr({}, ['resources', 'profile', 'data'], state),
});

const styled = withStyles(styles, { withTheme: true });

export default compose(
  styled,
  connect(mapStateToProps),
  preloaded
)(StackScriptCreate)
