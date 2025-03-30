import PropTypes from 'prop-types';
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

const MapController = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center.lat && center.lon) {
      map.flyTo([center.lat, center.lon], 15, {
        duration: 2
      });
    }
  }, [center, map]);

  return null;
};

MapController.propTypes = {
  center: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number
  }).isRequired
};

export default MapController;