ALTER TABLE purchases ADD COLUMN product_type TEXT NOT NULL DEFAULT 'consumable';
ALTER TABLE purchases ADD COLUMN collection_id TEXT;
ALTER TABLE purchases ADD COLUMN original_transaction_id TEXT;
ALTER TABLE revoked_transactions ADD COLUMN original_transaction_id TEXT;
CREATE INDEX purchases_original ON purchases(environment,original_transaction_id);
CREATE INDEX revocations_original ON revoked_transactions(environment,original_transaction_id);
CREATE TABLE store_entitlements(environment TEXT NOT NULL, original_transaction_id TEXT NOT NULL, account_id TEXT NOT NULL REFERENCES accounts(id), collection_id TEXT NOT NULL, granted_at INTEGER NOT NULL, revoked_at INTEGER, PRIMARY KEY(environment,original_transaction_id));
DROP TRIGGER reject_revoked_purchase;
CREATE TRIGGER reject_revoked_purchase BEFORE INSERT ON purchases
WHEN EXISTS(SELECT 1 FROM revoked_transactions WHERE environment=NEW.environment AND (transaction_id=NEW.transaction_id OR (original_transaction_id IS NOT NULL AND original_transaction_id=NEW.original_transaction_id)))
BEGIN SELECT RAISE(ABORT,'revoked transaction'); END;
CREATE TRIGGER reject_revoked_entitlement BEFORE INSERT ON store_entitlements
WHEN EXISTS(SELECT 1 FROM revoked_transactions WHERE environment=NEW.environment AND (transaction_id=NEW.original_transaction_id OR original_transaction_id=NEW.original_transaction_id))
BEGIN SELECT RAISE(ABORT,'revoked transaction'); END;
DROP TRIGGER apply_transaction_revocation;
CREATE TRIGGER apply_transaction_revocation AFTER INSERT ON revoked_transactions
BEGIN
 UPDATE accounts SET state=json_set(state,'$.gems',MAX(0,COALESCE(json_extract(state,'$.gems'),0)-COALESCE((SELECT SUM(gems) FROM purchases WHERE environment=NEW.environment AND revoked_at IS NULL AND (transaction_id=NEW.transaction_id OR original_transaction_id=NEW.original_transaction_id)),0)),'$.gemDebt',COALESCE(json_extract(state,'$.gemDebt'),0)+MAX(0,COALESCE((SELECT SUM(gems) FROM purchases WHERE environment=NEW.environment AND revoked_at IS NULL AND (transaction_id=NEW.transaction_id OR original_transaction_id=NEW.original_transaction_id)),0)-COALESCE(json_extract(state,'$.gems'),0)),'$.revision',revision+1),revision=revision+1 WHERE id IN(SELECT account_id FROM purchases WHERE environment=NEW.environment AND revoked_at IS NULL AND (transaction_id=NEW.transaction_id OR original_transaction_id=NEW.original_transaction_id));
 UPDATE store_entitlements SET revoked_at=NEW.revoked_at WHERE environment=NEW.environment AND revoked_at IS NULL AND (original_transaction_id=NEW.original_transaction_id OR original_transaction_id=NEW.transaction_id OR original_transaction_id=(SELECT original_transaction_id FROM purchases WHERE environment=NEW.environment AND transaction_id=NEW.transaction_id));
 UPDATE purchases SET revoked_at=NEW.revoked_at WHERE environment=NEW.environment AND revoked_at IS NULL AND (transaction_id=NEW.transaction_id OR original_transaction_id=NEW.original_transaction_id);
END;
