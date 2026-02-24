'use client';

import { useSettingsStore } from '@/stores/settings-store';
import { useTranslation } from '@/lib/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DbEngine } from '@/types/problem';

export default function DbSelector() {
  const { dbEngine, setDbEngine } = useSettingsStore();
  const { t } = useTranslation();

  return (
    <Select value={dbEngine} onValueChange={(v) => setDbEngine(v as DbEngine)}>
      <SelectTrigger className="w-[160px] h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="postgresql">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {t('db.postgresql')}
          </span>
        </SelectItem>
        <SelectItem value="mysql">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            {t('db.mysql')}
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
