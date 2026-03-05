package om.community.supportsystem.service;

import om.community.supportsystem.model.SystemSettings;
import om.community.supportsystem.repository.SystemSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SystemSettingsService {
    
    @Autowired
    private SystemSettingsRepository settingsRepository;
    
    public List<SystemSettings> getAllSettings() {
        return settingsRepository.findAll();
    }
    
    public Optional<SystemSettings> getSettingByKey(String key) {
        return settingsRepository.findBySettingKey(key);
    }
    
    public String getSettingValue(String key, String defaultValue) {
        return settingsRepository.findBySettingKey(key)
            .map(SystemSettings::getSettingValue)
            .orElse(defaultValue);
    }
    
    public SystemSettings updateSetting(String key, String value) {
        Optional<SystemSettings> existing = settingsRepository.findBySettingKey(key);
        if (existing.isPresent()) {
            SystemSettings setting = existing.get();
            setting.setSettingValue(value);
            setting.setUpdatedAt(LocalDateTime.now());
            return settingsRepository.save(setting);
        } else {
            SystemSettings newSetting = new SystemSettings();
            newSetting.setSettingKey(key);
            newSetting.setSettingValue(value);
            return settingsRepository.save(newSetting);
        }
    }
    
    public void deleteSetting(String key) {
        settingsRepository.findBySettingKey(key).ifPresent(settingsRepository::delete);
    }
}
