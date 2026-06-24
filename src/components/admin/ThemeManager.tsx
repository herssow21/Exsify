import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Palette, Star, AlertTriangle, CheckCircle, Info, Sun, Save, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import type { ThemeColors } from '../../context/ThemeContext';

const colorGroups: { label: string; icon: React.ElementType; keys: { key: keyof ThemeColors; label: string; desc: string }[] }[] = [
  {
    label: 'Primary Brand',
    icon: Palette,
    keys: [
      { key: 'primary', label: 'Primary', desc: 'Navbar, buttons, links, active states' },
      { key: 'primaryDark', label: 'Primary Dark', desc: 'Hover states, gradients' },
    ],
  },
  {
    label: 'Accent',
    icon: Star,
    keys: [
      { key: 'accent', label: 'Accent', desc: 'Stars, badges, highlights, featured' },
      { key: 'accentDark', label: 'Accent Dark', desc: 'Gradient ends' },
    ],
  },
  {
    label: 'Dark Theme',
    icon: Eye,
    keys: [
      { key: 'dark', label: 'Dark Base', desc: 'Admin dashboard background' },
      { key: 'darkLighter', label: 'Dark Lighter', desc: 'Cards, inputs on dark bg' },
    ],
  },
  {
    label: 'Status Colors',
    icon: AlertTriangle,
    keys: [
      { key: 'success', label: 'Success', desc: 'Online status, success messages' },
      { key: 'error', label: 'Error', desc: 'Delete actions, error messages' },
      { key: 'warning', label: 'Warning', desc: 'Pending status, warnings' },
    ],
  },
];

export default function ThemeManager() {
  const { colors, updateColor, resetTheme } = useTheme();
  const { showToast } = useToast();
  const [draft, setDraft] = useState<ThemeColors>(colors);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setDraft(prev => ({ ...prev, [key]: value }));
    updateColor(key, value);
  };

  const handleSave = () => {
    showToast('Theme saved successfully!', 'success');
  };

  const handleReset = () => {
    resetTheme();
    setDraft(colors);
    showToast('Theme reset to defaults', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-2">
            <Sun className="w-6 h-6 text-[hsl(var(--exsify-accent))]" />
            <h2 className="text-2xl font-bold text-white">Theme Settings</h2>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors font-semibold"
          >
            <Save className="w-4 h-4" />
            Save Theme
          </button>
        </div>
        <p className="text-gray-300">
          Customize the visual identity of your EXSIFY marketplace. Changes preview instantly — click Save to confirm.
        </p>
      </motion.div>

      {/* Color Groups */}
      <div className="grid gap-6">
        {colorGroups.map((group, gi) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-[hsl(var(--exsify-primary))]/20 p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <group.icon className="w-5 h-5 text-[hsl(var(--exsify-primary))]" />
              <h3 className="text-white font-bold text-lg">{group.label}</h3>
            </div>

            <div className={`grid gap-4 ${group.keys.length > 2 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
              {group.keys.map(({ key, label, desc }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-white/20 flex-shrink-0 cursor-pointer relative overflow-hidden"
                      style={{ backgroundColor: draft[key] }}
                    >
                      <input
                        type="color"
                        value={draft[key]}
                        onChange={e => handleColorChange(key, e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={draft[key]}
                        onChange={e => handleColorChange(key, e.target.value)}
                        className="w-full px-3 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white text-sm font-mono focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                      />
                      <p className="text-gray-500 text-xs mt-1">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-[hsl(var(--exsify-primary))]/20 p-6"
      >
        <h3 className="text-white font-bold text-lg mb-4">Live Preview</h3>
        <div className="flex flex-wrap items-center gap-4 p-4 bg-[hsl(var(--exsify-dark))] rounded-lg">
          <button className="px-4 py-2 rounded-lg font-semibold text-sm" style={{ backgroundColor: colors.primary, color: '#fff' }}>
            Primary Button
          </button>
          <button className="px-4 py-2 rounded-lg font-semibold text-sm" style={{ backgroundColor: colors.accent, color: '#1E293B' }}>
            Accent Button
          </button>
          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.success + '20', color: colors.success }}>
            <CheckCircle className="w-3 h-3 inline mr-1" /> Success
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.error + '20', color: colors.error }}>
            <AlertTriangle className="w-3 h-3 inline mr-1" /> Error
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.warning + '20', color: colors.warning }}>
            <Info className="w-3 h-3 inline mr-1" /> Warning
          </span>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-4 h-4" style={{ fill: colors.accent, color: colors.accent }} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors font-semibold"
        >
          <Save className="w-4 h-4" />
          Save Theme
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Defaults
        </button>
        <p className="text-gray-500 text-sm">
          Colors are saved to localStorage and persist across sessions.
        </p>
      </motion.div>
    </div>
  );
}
