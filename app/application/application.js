import $ from 'jquery';
import config from '../config'


export default class Application {
  initialize() {
    Parse.initialize(
      config.applicationId,
      config.javaScriptKey
    );
  }
}
