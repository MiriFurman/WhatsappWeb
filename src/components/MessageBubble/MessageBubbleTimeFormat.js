import moment from 'moment';

export const messageBubbleTimeFormatter = created => moment(created).format('hh:mm A | MMM DD, YYYY');
