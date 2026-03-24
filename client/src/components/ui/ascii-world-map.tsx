import { useMemo } from 'react';

// Simplified world map bitmap (each row is a string, '#' = land, ' ' = ocean)
// ~35 rows x 80 cols covering major continents
const WORLD_MAP_BITMAP = [
  '                                                                                ',
  '                          ####                    ##                             ',
  '                       ########            ##   #####                            ',
  '                     ##########            ###  ######  ##                        ',
  '                   #############     ##   ##### #######  ###                      ',
  '          #       ###############   ####  ############# #####                     ',
  '         ###     ################   ##### ##################                      ',
  '        #####   #################  #######################                        ',
  '       ######   ################## ########################                       ',
  '       #######  #########################################                         ',
  '       ########  ########################################                         ',
  '        ######   #######################################  ##                      ',
  '         #####    ####################################  #####                     ',
  '          ####     ##################################  #######                    ',
  '          ###       ######  ########################  #########                   ',
  '           ##       #####    #####################   ###########                  ',
  '            #        ####     ########  #########   ############                  ',
  '                      ###      ######    ########  ##############                 ',
  '                       ##       #####     #######  ##############                 ',
  '            ##          #        ###       ######   #############                 ',
  '           ####                  ##         #####    ############                 ',
  '          ######                 #          ####      ###########                 ',
  '         ########                            ###       #########                  ',
  '        ##########                           ##         ########                  ',
  '       ############                          #           ######       ##          ',
  '      ##############                                      #####      ###         ',
  '       #############                                       ###       ####        ',
  '        ###########                                         ##        ###        ',
  '         #########                                           #         ##        ',
  '          #######                                                       #        ',
  '           #####                                                                  ',
  '            ###                                                     ######       ',
  '             ##                                                    ########      ',
  '              #                                                    ########      ',
  '                                                                    ######       ',
];

const RANDOM_CHARS = 'juxzvycJUXZVYC{}\\|/[]<>~^+=*!?#@&%$.:;,_-1234567890abcdefghijklmnopqrstuvwxyz';

function getRandomChar(): string {
  return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
}

export function AsciiWorldMap() {
  const mapLines = useMemo(() => {
    return WORLD_MAP_BITMAP.map((row) => {
      let line = '';
      for (let i = 0; i < row.length; i++) {
        if (row[i] === '#') {
          line += getRandomChar();
        } else {
          line += ' ';
        }
      }
      return line;
    });
  }, []);

  return (
    <div
      className="select-none pointer-events-none font-mono text-[0.45rem] sm:text-[0.55rem] md:text-[0.65rem] leading-[1.1] whitespace-pre"
      aria-hidden="true"
      style={{ color: 'rgba(61, 112, 183, 0.35)' }}
    >
      {mapLines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}
