import { Action } from '../types/action';
import { Augment } from '../types/augment';
import { Unit } from '../types/unit';

type ErrorType = 'unit' | 'action' | 'augment';
type Error = {
  type: ErrorType;
  message: string;
};

export const validateIngest = (
  units: Record<string, Unit>,
  actions: Record<string, Action>,
  augments: Record<string, Augment>,
) => {
  const unitErrors = validateUnits(units, actions, augments);
  const actionErrors = validateActions(actions, augments, units);
  return [...unitErrors, ...actionErrors];
};

const validateUnits = (
  units: Record<string, Unit>,
  actions: Record<string, Action>,
  augments: Record<string, Augment>,
) => {
  const errors: Error[] = [];
  const ids = Object.values(units).map((unit) => unit.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    errors.push({
      type: 'unit',
      message: `Duplicate unit ids found: ${duplicateIds.join(', ')}`,
    });
  }

  Object.values(units).forEach((unit) => {
    if (unit.is_commander) {
      if (!unit.commander_data) {
        errors.push({
          type: 'unit',
          message: `Unit ${unit.id} is a commander but is missing commander data`,
        });
      } else {
        const { global_augments, army_augments, enemy_army_augments } = unit.commander_data;
        const invalidAugments = global_augments
          .concat(army_augments)
          .concat(enemy_army_augments)
          .filter((augmentId) => !(augmentId in augments));
        if (invalidAugments.length > 0) {
          errors.push({
            type: 'unit',
            message: `Unit ${unit.id} references invalid augments: ${invalidAugments.join(', ')}`,
          });
        }
      }
    }

    Object.values(unit.actions).forEach((action) => {
      if (!Number.isNaN(action)) {
        return;
      }
      if (action !== null && !(action in actions)) {
        errors.push({
          type: 'unit',
          message: `Unit ${unit.id} references action that does not exist: ${action}`,
        });
      }
    });
  });

  return errors;
};

const validateActions = (
  actions: Record<string, Action>,
  augments: Record<string, Augment>,
  units: Record<string, Unit>,
) => {
  const errors: Error[] = [];
  const ids = Object.values(actions).map((action) => action.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    errors.push({
      type: 'action',
      message: `Duplicate action ids found: ${duplicateIds.join(', ')}`,
    });
  }

  Object.values(actions).forEach((action) => {
    if (action.action_type === 'AUGMENT_ACTION') {
      const invalidAugments = action.augment_action_props.augments
        .concat(action.augment_action_props.crit_augments)
        .filter((augmentId) => !(augmentId in augments));

      if (invalidAugments.length > 0) {
        errors.push({
          type: 'action',
          message: `Augment action ${
            action.id
          } references invalid augments: ${invalidAugments.join(', ')}`,
        });
      }
    }

    if (action.action_type === 'SUMMON_ACTION') {
      if (
        action.summon_action_props.summon_augment !== null &&
        !(action.summon_action_props.summon_augment in augments)
      ) {
        errors.push({
          type: 'action',
          message: `Summon action ${action.id} references invalid summon augment: ${action.summon_action_props.summon_augment}`,
        });
      }
      const invalidSummonIds = action.summon_action_props.summons.filter((id) => !(id in units));
      if (invalidSummonIds.length > 0) {
        errors.push({
          type: 'action',
          message: `Action ${
            action.id
          } references invalid summon ids: ${invalidSummonIds.join(', ')}`,
        });
      }
    }

    if (action.action_type === 'DAMAGE_ACTION') {
      const invalidAugments = action.damage_action_props.augments
        .concat(action.damage_action_props.crit_augments)
        .filter((augmentId) => !(augmentId in augments));

      if (invalidAugments.length > 0) {
        errors.push({
          type: 'action',
          message: `Damage action ${
            action.id
          } references invalid augments: ${invalidAugments.join(', ')}`,
        });
      }
    }

    if (action.action_type === 'MANA_ACTION' && action.mana_action_props.tag_augment !== null) {
      if (!(action.mana_action_props.tag_augment in augments)) {
        errors.push({
          type: 'action',
          message: `Mana action ${action.id} references invalid tag augment: ${action.mana_action_props.tag_augment}`,
        });
      }
    }

    if (action.action_type === 'TAG_ACTION' && action.tag_action_props.tag_augment !== null) {
      if (!(action.tag_action_props.tag_augment in augments)) {
        errors.push({
          type: 'action',
          message: `Tag action ${action.id} references invalid tag augment: ${action.tag_action_props.tag_augment}`,
        });
      }
    }
  });

  return errors;
};
