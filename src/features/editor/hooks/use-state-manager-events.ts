import { useEffect, useCallback, useRef } from "react";
import StateManager from "@designcombo/state";
import useStore from "../store/use-store";
import { IAudio, ITrackItem, IVideo } from "@designcombo/types";
import { audioDataManager } from "../player/lib/audio-data";

// Global registry to prevent duplicate subscriptions
const subscriptionRegistry = new WeakMap<StateManager, Set<string>>();

export const useStateManagerEvents = (stateManager: StateManager) => {
	const { setState } = useStore();
	const isSubscribedRef = useRef(false);

	// Handle track item updates
	const handleTrackItemUpdate = useCallback(() => {
		const currentState = stateManager.getState();
		const mergedTrackItemsDeatilsMap = currentState.trackItemsMap;
		const filterTrakcItems = Object.values(mergedTrackItemsDeatilsMap).filter(
			(item) => {
				return item.type === "video" || item.type === "audio";
			},
		);
		audioDataManager.setItems(
			filterTrakcItems as (ITrackItem & (IVideo | IAudio))[],
		);
		audioDataManager.validateUpdateItems(
			filterTrakcItems as (ITrackItem & (IVideo | IAudio))[],
		);
		setState({
			duration: currentState.duration,
			trackItemsMap: currentState.trackItemsMap,
		});
	}, [stateManager, setState]);

	const handleAddRemoveItems = useCallback(() => {
		const currentState = stateManager.getState();
		const mergedTrackItemsDeatilsMap = currentState.trackItemsMap;

		const filterTrakcItems = Object.values(mergedTrackItemsDeatilsMap).filter(
			(item) => {
				return item.type === "video" || item.type === "audio";
			},
		);
		audioDataManager.validateUpdateItems(
			filterTrakcItems as (ITrackItem & (IVideo | IAudio))[],
		);
		setState({
			trackItemsMap: currentState.trackItemsMap,
			trackItemIds: currentState.trackItemIds,
			tracks: currentState.tracks,
		});
	}, [stateManager, setState]);

	const handleUpdateItemDetails = useCallback(() => {
		const currentState = stateManager.getState();
		setState({
			trackItemsMap: currentState.trackItemsMap,
		});
	}, [stateManager, setState]);

	useEffect(() => {
		console.log("useStateManagerEvents", stateManager);
		// Check if we already have subscriptions for this stateManager
		if (!subscriptionRegistry.has(stateManager)) {
			subscriptionRegistry.set(stateManager, new Set());
		}

		const registry = subscriptionRegistry.get(stateManager);
		if (!registry) return;
		const hookId = "useStateManagerEvents";

		// Prevent duplicate subscriptions
		if (registry.has(hookId)) {
			return;
		}

		registry.add(hookId);
		isSubscribedRef.current = true;

		// Subscribe to state update details
		const resizeDesignSubscription = stateManager.subscribeToUpdateStateDetails(
			(newState) => {
				setState(newState);
			},
		);

		// Subscribe to scale changes
		const scaleSubscription = stateManager.subscribeToScale((newState) => {
			setState(newState);
		});

		// Subscribe to general state changes
		const tracksSubscription = stateManager.subscribeToState((newState) => {
			setState(newState);
		});

		// Subscribe to duration changes
		const durationSubscription = stateManager.subscribeToDuration(
			(newState) => {
				setState(newState);
			},
		);

		// Subscribe to track item updates
		const updateTrackItemsMap = stateManager.subscribeToUpdateTrackItem(
			handleTrackItemUpdate,
		);

		// Subscribe to add/remove items
		const itemsDetailsSubscription =
			stateManager.subscribeToAddOrRemoveItems(handleAddRemoveItems);

		// Subscribe to item details updates
		const updateItemDetailsSubscription =
			stateManager.subscribeToUpdateItemDetails(handleUpdateItemDetails);

		// Cleanup function to unsubscribe from all events
		return () => {
			if (isSubscribedRef.current) {
				scaleSubscription.unsubscribe();
				tracksSubscription.unsubscribe();
				durationSubscription.unsubscribe();
				itemsDetailsSubscription.unsubscribe();
				updateTrackItemsMap.unsubscribe();
				updateItemDetailsSubscription.unsubscribe();
				resizeDesignSubscription.unsubscribe();

				// Remove from registry
				registry.delete(hookId);
				isSubscribedRef.current = false;
			}
		};
	}, [
		stateManager,
		setState,
		handleTrackItemUpdate,
		handleAddRemoveItems,
		handleUpdateItemDetails,
	]);
};
