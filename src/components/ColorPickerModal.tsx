import { PLAYABLE_COLORS, type PlayableColor } from '@/types/game';

interface ColorPickerModalProps {
  onChoose: (color: PlayableColor) => void;
}

const COLOR_LABELS: Record<PlayableColor, string> = {
  red: 'Красный',
  blue: 'Синий',
  green: 'Зелёный',
  yellow: 'Жёлтый',
};

const COLOR_CLASS: Record<PlayableColor, string> = {
  red: 'bg-uno-red hover:brightness-110',
  blue: 'bg-uno-blue hover:brightness-110',
  green: 'bg-uno-green hover:brightness-110',
  yellow: 'bg-uno-yellow hover:brightness-95 text-black',
};

const ColorPickerModal = ({ onChoose }: ColorPickerModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 text-center shadow-xl">
        <h3 className="text-xl font-bold mb-2">Выбери цвет</h3>
        <p className="mb-4 text-gray-600">Эта карта задаёт новый цвет стола</p>
        <div className="grid grid-cols-2 gap-3">
          {PLAYABLE_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChoose(color)}
              className={`${COLOR_CLASS[color]} text-white font-bold py-3 px-6 rounded-xl transition-transform hover:scale-105`}
            >
              {COLOR_LABELS[color]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPickerModal;
