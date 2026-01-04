import ColorSwatchGrid from '../ColorSwatchGrid';
import ColorTable from '../ColorTable';

export default function ColourPalettes() {
  return (
    <div className="space-y-12">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">Colour</p>
        <h1 className="font-serif text-[40px] leading-[1.15] font-medium mb-4">
          Palettes
        </h1>
      </div>

      <hr className="border-t-4 border-textDefault" />

      {/* Brand Section */}
      <section>
        <h2 id="brand" className="font-serif text-[32px] leading-[1.2] font-medium mb-6 scroll-mt-32">
          Brand
        </h2>

        <ColorSwatchGrid
          swatches={[
            { name: 'Black', hex: '#000000', textColor: 'light' },
            { name: 'White', hex: '#FFFFFF', textColor: 'dark' },
            { name: 'Electric Pink', hex: '#E43C81', textColor: 'light' },
            { name: 'Electric Pink 60', hex: '#EE6FA5', textColor: 'light' },
          ]}
        />

        <ColorTable
          colors={[
            {
              name: 'Black',
              hex: '#000000',
              rgb: '0, 0, 0',
              hsl: '0°, 0%, 0%',
              token: '--color-brand-black',
            },
            {
              name: 'White',
              hex: '#FFFFFF',
              rgb: '255, 255, 255',
              hsl: '0°, 0%, 100%',
              token: '--color-brand-white',
            },
            {
              name: 'Electric Pink',
              hex: '#E43C81',
              rgb: '228, 60, 129',
              hsl: '333°, 74%, 57%',
              token: '--color-brand-electric-pink',
            },
            {
              name: 'Electric Pink 60',
              hex: '#EE6FA5',
              rgb: '238, 111, 165',
              hsl: '333°, 74%, 68%',
              token: '--color-brand-electric-pink-60',
            },
          ]}
        />
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Accent Section */}
      <section>
        <h2 id="accent" className="font-serif text-[32px] leading-[1.2] font-medium mb-6 scroll-mt-32">
          Accent
        </h2>

        {/* Primary - Pace Purple */}
        <div className="mb-12">
          <hr className="border-t border-borderNeutral mb-6" />
          <h3 id="accent-primary" className="font-serif text-[24px] leading-[1.3] font-medium mb-6 scroll-mt-32">
            Primary
          </h3>

          <ColorSwatchGrid
            swatches={[
              { name: 'Pace Purple 20', hex: '#1F1352', textColor: 'light' },
              { name: 'Pace Purple 30', hex: '#2E1C7A', textColor: 'light' },
              { name: 'Pace Purple 45', hex: '#452BB8', textColor: 'light' },
              { name: 'Pace Purple 55', hex: '#5E3FD1', textColor: 'light' },
              { name: 'Pace Purple 90', hex: '#DBD6F5', textColor: 'dark' },
              { name: 'Pace Purple 95', hex: '#EDEBFA', textColor: 'dark' },
            ]}
          />

          <ColorTable
            colors={[
              {
                name: 'Pace Purple 20',
                hex: '#1F1352',
                rgb: '31, 19, 82',
                hsl: '262°, 60%, 20%',
                token: '--color-pace-purple-20',
              },
              {
                name: 'Pace Purple 30',
                hex: '#2E1C7A',
                rgb: '46, 28, 122',
                hsl: '262°, 60%, 30%',
                token: '--color-pace-purple-30',
              },
              {
                name: 'Pace Purple 45',
                hex: '#452BB8',
                rgb: '69, 43, 184',
                hsl: '262°, 60%, 45%',
                token: '--color-pace-purple-45',
              },
              {
                name: 'Pace Purple 55',
                hex: '#5E3FD1',
                rgb: '94, 63, 209',
                hsl: '262°, 60%, 55%',
                token: '--color-pace-purple-55',
              },
              {
                name: 'Pace Purple 90',
                hex: '#DBD6F5',
                rgb: '219, 214, 245',
                hsl: '262°, 60%, 90%',
                token: '--color-pace-purple-90',
              },
              {
                name: 'Pace Purple 95',
                hex: '#EDEBFA',
                rgb: '237, 235, 250',
                hsl: '262°, 60%, 95%',
                token: '--color-pace-purple-95',
              },
            ]}
          />
        </div>

        {/* Secondary - Volt Green & Signal Orange */}
        <div className="mb-12">
          <hr className="border-t border-borderNeutral mb-6" />
          <h3 id="accent-secondary" className="font-serif text-[24px] leading-[1.3] font-medium mb-6 scroll-mt-32">
            Secondary
          </h3>

          <ColorSwatchGrid
            swatches={[
              { name: 'Volt Green 20', hex: '#003319', textColor: 'light' },
              { name: 'Volt Green 30', hex: '#004D26', textColor: 'light' },
              { name: 'Volt Green 45', hex: '#00733A', textColor: 'light' },
              { name: 'Volt Green 55', hex: '#008C47', textColor: 'light' },
              { name: 'Volt Green 90', hex: '#CCF5E0', textColor: 'dark' },
              { name: 'Volt Green 95', hex: '#E6FAEF', textColor: 'dark' },
              { name: 'Signal Orange 20', hex: '#331100', textColor: 'light' },
              { name: 'Signal Orange 30', hex: '#4D1A00', textColor: 'light' },
              { name: 'Signal Orange 45', hex: '#732600', textColor: 'light' },
              { name: 'Signal Orange 55', hex: '#8C2F00', textColor: 'light' },
              { name: 'Signal Orange 90', hex: '#F5D6CC', textColor: 'dark' },
              { name: 'Signal Orange 95', hex: '#FAEBE6', textColor: 'dark' },
            ]}
          />

          <ColorTable
            colors={[
              {
                name: 'Volt Green 20',
                hex: '#003319',
                rgb: '0, 51, 25',
                hsl: '146°, 100%, 20%',
                token: '--color-volt-green-20',
              },
              {
                name: 'Volt Green 30',
                hex: '#004D26',
                rgb: '0, 77, 38',
                hsl: '146°, 100%, 30%',
                token: '--color-volt-green-30',
              },
              {
                name: 'Volt Green 45',
                hex: '#00733A',
                rgb: '0, 115, 58',
                hsl: '146°, 100%, 45%',
                token: '--color-volt-green-45',
              },
              {
                name: 'Volt Green 55',
                hex: '#008C47',
                rgb: '0, 140, 71',
                hsl: '146°, 100%, 55%',
                token: '--color-volt-green-55',
              },
              {
                name: 'Volt Green 90',
                hex: '#CCF5E0',
                rgb: '204, 245, 224',
                hsl: '146°, 100%, 90%',
                token: '--color-volt-green-90',
              },
              {
                name: 'Volt Green 95',
                hex: '#E6FAEF',
                rgb: '230, 250, 239',
                hsl: '146°, 100%, 95%',
                token: '--color-volt-green-95',
              },
              {
                name: 'Signal Orange 20',
                hex: '#331100',
                rgb: '51, 17, 0',
                hsl: '14°, 100%, 20%',
                token: '--color-signal-orange-20',
              },
              {
                name: 'Signal Orange 30',
                hex: '#4D1A00',
                rgb: '77, 26, 0',
                hsl: '14°, 100%, 30%',
                token: '--color-signal-orange-30',
              },
              {
                name: 'Signal Orange 45',
                hex: '#732600',
                rgb: '115, 38, 0',
                hsl: '14°, 100%, 45%',
                token: '--color-signal-orange-45',
              },
              {
                name: 'Signal Orange 55',
                hex: '#8C2F00',
                rgb: '140, 47, 0',
                hsl: '14°, 100%, 55%',
                token: '--color-signal-orange-55',
              },
              {
                name: 'Signal Orange 90',
                hex: '#F5D6CC',
                rgb: '245, 214, 204',
                hsl: '14°, 100%, 90%',
                token: '--color-signal-orange-90',
              },
              {
                name: 'Signal Orange 95',
                hex: '#FAEBE6',
                rgb: '250, 235, 230',
                hsl: '14°, 100%, 95%',
                token: '--color-signal-orange-95',
              },
            ]}
          />
        </div>

        {/* Tertiary - Track Red & Trail Brown */}
        <div className="mb-12">
          <hr className="border-t border-borderNeutral mb-6" />
          <h3 id="accent-tertiary" className="font-serif text-[24px] leading-[1.3] font-medium mb-6 scroll-mt-32">
            Tertiary
          </h3>

          <ColorSwatchGrid
            swatches={[
              { name: 'Track Red 20', hex: '#520A0A', textColor: 'light' },
              { name: 'Track Red 30', hex: '#7A0F0F', textColor: 'light' },
              { name: 'Track Red 45', hex: '#B81616', textColor: 'light' },
              { name: 'Track Red 55', hex: '#D11B1B', textColor: 'light' },
              { name: 'Track Red 90', hex: '#F5D2D2', textColor: 'dark' },
              { name: 'Track Red 95', hex: '#FAE9E9', textColor: 'dark' },
              { name: 'Trail Brown 20', hex: '#331A0D', textColor: 'light' },
              { name: 'Trail Brown 30', hex: '#4D2713', textColor: 'light' },
              { name: 'Trail Brown 45', hex: '#73391D', textColor: 'light' },
              { name: 'Trail Brown 55', hex: '#8C4623', textColor: 'light' },
              { name: 'Trail Brown 90', hex: '#F5E6D9', textColor: 'dark' },
              { name: 'Trail Brown 95', hex: '#FAF2EC', textColor: 'dark' },
            ]}
          />

          <ColorTable
            colors={[
              {
                name: 'Track Red 20',
                hex: '#520A0A',
                rgb: '82, 10, 10',
                hsl: '0°, 79%, 20%',
                token: '--color-track-red-20',
              },
              {
                name: 'Track Red 30',
                hex: '#7A0F0F',
                rgb: '122, 15, 15',
                hsl: '0°, 79%, 30%',
                token: '--color-track-red-30',
              },
              {
                name: 'Track Red 45',
                hex: '#B81616',
                rgb: '184, 22, 22',
                hsl: '0°, 79%, 45%',
                token: '--color-track-red-45',
              },
              {
                name: 'Track Red 55',
                hex: '#D11B1B',
                rgb: '209, 27, 27',
                hsl: '0°, 79%, 55%',
                token: '--color-track-red-55',
              },
              {
                name: 'Track Red 90',
                hex: '#F5D2D2',
                rgb: '245, 210, 210',
                hsl: '0°, 79%, 90%',
                token: '--color-track-red-90',
              },
              {
                name: 'Track Red 95',
                hex: '#FAE9E9',
                rgb: '250, 233, 233',
                hsl: '0°, 79%, 95%',
                token: '--color-track-red-95',
              },
              {
                name: 'Trail Brown 20',
                hex: '#331A0D',
                rgb: '51, 26, 13',
                hsl: '25°, 59%, 20%',
                token: '--color-trail-brown-20',
              },
              {
                name: 'Trail Brown 30',
                hex: '#4D2713',
                rgb: '77, 39, 19',
                hsl: '25°, 59%, 30%',
                token: '--color-trail-brown-30',
              },
              {
                name: 'Trail Brown 45',
                hex: '#73391D',
                rgb: '115, 57, 29',
                hsl: '25°, 59%, 45%',
                token: '--color-trail-brown-45',
              },
              {
                name: 'Trail Brown 55',
                hex: '#8C4623',
                rgb: '140, 70, 35',
                hsl: '25°, 59%, 55%',
                token: '--color-trail-brown-55',
              },
              {
                name: 'Trail Brown 90',
                hex: '#F5E6D9',
                rgb: '245, 230, 217',
                hsl: '25°, 59%, 90%',
                token: '--color-trail-brown-90',
              },
              {
                name: 'Trail Brown 95',
                hex: '#FAF2EC',
                rgb: '250, 242, 236',
                hsl: '25°, 59%, 95%',
                token: '--color-trail-brown-95',
              },
            ]}
          />
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Greyscale Section */}
      <section>
        <h2 id="greyscale" className="font-serif text-[32px] leading-[1.2] font-medium mb-6 scroll-mt-32">
          Greyscale
        </h2>

        <ColorSwatchGrid
          swatches={[
            { name: 'Asphalt 5', hex: '#0D0D0D', textColor: 'light' },
            { name: 'Asphalt 10', hex: '#1A1A1A', textColor: 'light' },
            { name: 'Asphalt 20', hex: '#333333', textColor: 'light' },
            { name: 'Asphalt 35', hex: '#595959', textColor: 'light' },
            { name: 'Asphalt 50', hex: '#808080', textColor: 'light' },
            { name: 'Asphalt 70', hex: '#B3B3B3', textColor: 'dark' },
            { name: 'Asphalt 85', hex: '#D9D9D9', textColor: 'dark' },
            { name: 'Asphalt 95', hex: '#F2F2F2', textColor: 'dark' },
            { name: 'Asphalt 98', hex: '#FAFAFA', textColor: 'dark' },
            { name: 'Asphalt 100', hex: '#FFFFFF', textColor: 'dark' },
          ]}
        />

        <ColorTable
          colors={[
            {
              name: 'Asphalt 5',
              hex: '#0D0D0D',
              rgb: '13, 13, 13',
              hsl: '0°, 0%, 5%',
              token: '--color-asphalt-5',
            },
            {
              name: 'Asphalt 10',
              hex: '#1A1A1A',
              rgb: '26, 26, 26',
              hsl: '0°, 0%, 10%',
              token: '--color-asphalt-10',
            },
            {
              name: 'Asphalt 20',
              hex: '#333333',
              rgb: '51, 51, 51',
              hsl: '0°, 0%, 20%',
              token: '--color-asphalt-20',
            },
            {
              name: 'Asphalt 35',
              hex: '#595959',
              rgb: '89, 89, 89',
              hsl: '0°, 0%, 35%',
              token: '--color-asphalt-35',
            },
            {
              name: 'Asphalt 50',
              hex: '#808080',
              rgb: '128, 128, 128',
              hsl: '0°, 0%, 50%',
              token: '--color-asphalt-50',
            },
            {
              name: 'Asphalt 70',
              hex: '#B3B3B3',
              rgb: '179, 179, 179',
              hsl: '0°, 0%, 70%',
              token: '--color-asphalt-70',
            },
            {
              name: 'Asphalt 85',
              hex: '#D9D9D9',
              rgb: '217, 217, 217',
              hsl: '0°, 0%, 85%',
              token: '--color-asphalt-85',
            },
            {
              name: 'Asphalt 95',
              hex: '#F2F2F2',
              rgb: '242, 242, 242',
              hsl: '0°, 0%, 95%',
              token: '--color-asphalt-95',
            },
            {
              name: 'Asphalt 98',
              hex: '#FAFAFA',
              rgb: '250, 250, 250',
              hsl: '0°, 0%, 98%',
              token: '--color-asphalt-98',
            },
            {
              name: 'Asphalt 100',
              hex: '#FFFFFF',
              rgb: '255, 255, 255',
              hsl: '0°, 0%, 100%',
              token: '--color-asphalt-100',
            },
          ]}
        />
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Canvas Section */}
      <section>
        <h2 id="canvas" className="font-serif text-[32px] leading-[1.2] font-medium mb-6 scroll-mt-32">
          Canvas
        </h2>

        <ColorSwatchGrid
          swatches={[
            { name: 'Warm Light', hex: '#FAFAF8', textColor: 'dark' },
            { name: 'Warm Medium', hex: '#F5F5F3', textColor: 'dark' },
            { name: 'Cool Light', hex: '#F8F9FA', textColor: 'dark' },
            { name: 'Cool Medium', hex: '#F3F4F5', textColor: 'dark' },
            { name: 'Neutral', hex: '#F7F7F7', textColor: 'dark' },
          ]}
        />

        <ColorTable
          colors={[
            {
              name: 'Warm Light',
              hex: '#FAFAF8',
              rgb: '250, 250, 248',
              hsl: '60°, 20%, 98%',
              token: '--color-canvas-warm-light',
            },
            {
              name: 'Warm Medium',
              hex: '#F5F5F3',
              rgb: '245, 245, 243',
              hsl: '60°, 20%, 96%',
              token: '--color-canvas-warm-medium',
            },
            {
              name: 'Cool Light',
              hex: '#F8F9FA',
              rgb: '248, 249, 250',
              hsl: '210°, 20%, 98%',
              token: '--color-canvas-cool-light',
            },
            {
              name: 'Cool Medium',
              hex: '#F3F4F5',
              rgb: '243, 244, 245',
              hsl: '210°, 20%, 96%',
              token: '--color-canvas-cool-medium',
            },
            {
              name: 'Neutral',
              hex: '#F7F7F7',
              rgb: '247, 247, 247',
              hsl: '0°, 0%, 97%',
              token: '--color-canvas-neutral',
            },
          ]}
        />
      </section>
    </div>
  );
}
