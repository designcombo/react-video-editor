import { DEFAULT_FONT } from '@/data/fonts';
import {
  ACTIVE_CLONE,
  ACTIVE_DELETE,
  ADD_TEXT,
  HISTORY_REDO,
  HISTORY_UNDO,
  LAYER_SELECT,
  PLAYER_SEEK_BY,
  PLAYER_TOGGLE_PLAY,
  dispatcher,
} from '@designcombo/core';
import hotkeys from 'hotkeys-js';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';

const useHotkeys = () => {
  useEffect(() => {
    const dispatch = dispatcher.dispatch;
    // handle undo
    hotkeys('ctrl+z,command+z', (event) => {
      event.preventDefault(); // Prevent the default action
      dispatch(HISTORY_UNDO);
      // dispatch(UNDO);
    });

    // handle redo: ctrl+shift+z
    hotkeys('ctrl+shift+z,command+shift+z', (event) => {
      event.preventDefault(); // Prevent the default action
      //   redo();
      dispatch(HISTORY_REDO);
    });

    // Define the shortcut and corresponding action
    hotkeys('ctrl+s,command+s', (event) => {
      event.preventDefault(); // Prevent the default action
      console.log('split action');
      //   dispatch(ACTIVE_SPLIT);
    });

    // duplicate item
    hotkeys('ctrl+d,command+d', (event) => {
      event.preventDefault(); // Prevent the default action
      dispatch(ACTIVE_CLONE);
    });

    hotkeys('backspace,delete', (event) => {
      event.preventDefault(); // Prevent the default action
      dispatch(ACTIVE_DELETE);
    });

    hotkeys('esc', (event) => {
      event.preventDefault(); // Prevent the default action
      dispatcher.dispatch(LAYER_SELECT, { payload: { activeIds: [] } });
    });

    hotkeys('space', (event) => {
      event.preventDefault();
      dispatch(PLAYER_TOGGLE_PLAY);
    });

    hotkeys('down', (event) => {
      event.preventDefault();
      dispatch(PLAYER_SEEK_BY, { payload: { frames: 1 } });
    });

    hotkeys('up', (event) => {
      event.preventDefault();
      dispatch(PLAYER_SEEK_BY, { payload: { frames: -1 } });
    });

    // New shortcut for the 'T' key
    hotkeys('t', (event) => {
      dispatcher.dispatch(ADD_TEXT, {
        payload: {
          id: nanoid(),
          details: {
            text: 'Add text',
            fontSize: 62,
            fontFamily: DEFAULT_FONT.postScriptName,
            fontUrl: DEFAULT_FONT.url,
            width: 400,
            textAlign: 'left',
            color: '#ffffff',
          },
        },
      });
    });

    return () => {
      hotkeys.unbind('ctrl+shift+z,command+shift+z');
      hotkeys.unbind('ctrl+z,command+z');
      hotkeys.unbind('ctrl+s,command+s');
      hotkeys.unbind('ctrl+d,command+d');
      hotkeys.unbind('backspace,delete');
      hotkeys.unbind('escape');
      hotkeys.unbind('down');
      hotkeys.unbind('up');
      hotkeys.unbind('space');
      hotkeys.unbind('t');
    };
  }, []);
};

export default useHotkeys;
